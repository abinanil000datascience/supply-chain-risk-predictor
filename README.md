# Supply Chain Risk Predictor

### An End-to-End Predictive Analytics Solution for Supply Chain Risk

Engineered by **Abin Anil, AI Engineer**, this project is a full-stack mono-repo application designed to predict operational risks and operational failures within enterprise supply chain logistics. Developed with a grounding in enterprise IT architecture and MLOps principles, the application serves a high-performance XGBoost model through a Django API backend to a modern Vite frontend interface.

## 📌 Context and Engineering History

This project was built to address the significant challenges present in sparse and heavily class-imbalanced supply chain logistical data (e.g., 97% on-time vs. 3% delayed).

Drawing upon my expertise in Python-based predictive systems and MLOps, this solution ensures that model training assets are properly serialized and deployed within a scalable architecture. The pipeline was engineered for real-time inference, utilizing a pre-packaged preprocessing pipeline to ensure input data consistent with the model's high-dimensional vector space.

## 🚀 Key Features

*   **Real-time Inference REST API:** Backend serves predictions instantly via an HTTP request/response cycle.
*   **Serialized ML Assets:** Directly integrates high-performance model JSON (`supply_chain_xgboost.json`) and preprocessing pickle (`preprocessor.pkl`) objects within the API view.
*   **Modern Frontend Dashboard:** A modern SPA dashboard built with Vite for intuitive data entry, real-time risk status visualization, and shipment history tracking.
*   **Handling Class-Imbalance:** XGBoost model optimized for identifying rare risk events (failures/delays).

## 🛠️ Tech Stack

*   **Machine Learning (Core):** Python, XGBoost, Scikit-Learn (preprocessing), Pandas, NumPy.
*   **Backend API & IT Architecture:** Python, Django, Django REST Framework (DRF), ITIL monitoring principles.
*   **Frontend UI/UX:** JavaScript, Vite, React (implied standard SPA configuration).

## 📌 Repository Architecture & ML Asset Location

This is a mono-repo. Based on standard engineering patterns, the frontend is self-contained while the root manages the Django backend execution:

```text
/                       # Root Directory (manage.py deployment entry)
├── api/                # Django Application Folder (Core Logic)
│   ├── models.py       # DB Schema for history tracking
│   ├── views.py        # Inference Logic [Loads ML assets, runs inference]
│   ├── urls.py         # App-specific Routing
│   ├── tests.py        # Backend Pytest Unit/Integration tests
│   ├── preprocessor.pkl # Serialized Scikit-learn Pipeline [THE PREPROCESSOR]
│   └── supply_chain_xgboost.json # Serialized XGBoost Model [THE MODEL]
├── backend/            # Django Project Configuration Folder (settings.py, CORS config)
├── frontend/           # Vite/React Frontend Application Folder
│   ├── src/            # JS source code (Components, API hooks)
│   ├── package.json    # Frontend dependencies and scripts
│   └── vite.config.js  # Vite dev server and build configuration
└── .gitignore          # Ignores venv/, node_modules/, local settings
