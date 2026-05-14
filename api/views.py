import os
import pandas as pd
import xgboost as xgb
import joblib
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import json
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt

# 1. Load BOTH brains when the Django server boots up
# Ensure your preprocessor.pkl and supply_chain_xgboost.json are inside your 'api' folder
model_path = os.path.join(settings.BASE_DIR, 'api', 'supply_chain_xgboost.json')
preprocessor_path = os.path.join(settings.BASE_DIR, 'api', 'preprocessor.pkl')

model = xgb.XGBClassifier()
model.load_model(model_path)
preprocessor = joblib.load(preprocessor_path)

# 2. Define the exact feature order used during training
features = [
    'Carrier', 'Origin Port', 'Destination Port', 'Service Level', 
    'Plant Code', 'Customer', 'Weight', 'Unit quantity', 'TPT', 
    'Order_Month', 'Order_DayOfWeek', 'Is_Weekend'
]

@api_view(['POST'])
@csrf_exempt
def predict_delivery(request):
    try:
        # 3. Read the incoming React JSON payload
        df = pd.DataFrame([request.data])
        
        # 4. Process the dates identically to the training script
        df['Order Date'] = pd.to_datetime(df['Order Date'], format='%d-%m-%Y', errors='coerce')
        df['Order_Month'] = df['Order Date'].dt.month
        df['Order_DayOfWeek'] = df['Order Date'].dt.dayofweek
        df['Is_Weekend'] = (df['Order Date'].dt.dayofweek >= 5).astype(int)
        
        # Isolate the exact features needed
        X_new = df[features]
        
        # 5. THE PROFESSIONAL PIPELINE IN ACTION
        # The .pkl file intercepts the text. It converts known words to numbers.
        # If a user types a brand new Customer ID or Port, it safely converts it to -1.
        X_processed = preprocessor.transform(X_new)
        
        # 6. Predict using the safe, purely numerical array
        probability = model.predict_proba(X_processed)[:, 1][0]
        
        # 7. Package the response
        # UPDATED: Lowered to 0.0002 to catch this specific risk profile
        optimal_threshold = 0.0002 
        
        if probability >= optimal_threshold:
            return Response({"prediction": "LATE", "risk_percentage": round(probability * 100, 4)})
        else:
            return Response({"prediction": "ON TIME", "risk_percentage": round(probability * 100, 4)})
            
    except Exception as e:
        print("💥 SERVER CRASH REPORT:", repr(e))
        return Response({"error": str(e)}, status=400)
    
@csrf_exempt
def signup_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            password = data.get('password')
            
            if User.objects.filter(username=email).exists():
                return JsonResponse({"error": "Email is already registered."}, status=400)

            user = User.objects.create_user(username=email, email=email, password=password, first_name=name)
            user.save()
            return JsonResponse({"message": "Account created successfully!"}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            user = authenticate(request, username=email, password=password)

            if user is not None:
                login(request, user) 
                return JsonResponse({"message": "Login successful!"}, status=200)
            else:
                return JsonResponse({"error": "Invalid email or password."}, status=401)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)