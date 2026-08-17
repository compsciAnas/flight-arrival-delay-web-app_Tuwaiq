export const classificationModels = [
  { name: "Logistic Regression", train: 0.9681, validation: 0.9572, test: 0.9649, f1: 0.8214, selected: true },
  { name: "KNN", train: 0.9411, validation: 0.8981, test: 0.8969, f1: 0.5594 },
  { name: "Decision Tree", train: 0.9700, validation: 0.9481, test: 0.9510, f1: 0.7939 },
  { name: "Random Forest", train: 0.9642, validation: 0.9393, test: 0.9500, f1: 0.8180 },
  { name: "Gradient Boosting", train: 0.9930, validation: 0.9574, test: 0.9631, f1: 0.8348 },
  { name: "SVM (RBF)", train: 0.9854, validation: 0.9557, test: 0.9639, f1: 0.8310 },
];

export const regressionModels = [
  { name: "Linear Regression", mae: 7.2919, rmse: 10.3488, r2: 0.9579, selected: true },
  { name: "KNN Regressor", mae: 12.5411, rmse: 18.3577, r2: 0.8676 },
  { name: "Decision Tree Regressor", mae: 8.5619, rmse: 13.8590, r2: 0.9246 },
  { name: "Random Forest Regressor", mae: 7.7912, rmse: 11.0553, r2: 0.9520 },
  { name: "Gradient Boosting Regressor", mae: 8.2921, rmse: 19.1833, r2: 0.8555 },
  { name: "SVR (RBF)", mae: 9.3863, rmse: 31.3088, r2: 0.6150 },
];

export const dayDelay = [
  ["Mon", 6.63], ["Tue", 4.92], ["Wed", 3.92], ["Thu", 7.08],
  ["Fri", 8.03], ["Sat", 2.31], ["Sun", 4.42],
] as const;

export const monthDelay = [2.80, 5.17, 3.00, 4.23, 7.27, 10.26, 9.68, 11.51, 2.98, 3.04, 5.60, 3.71];

export const airlineRates = [
  ["JetBlue", 27.31], ["ExpressJet", 21.30], ["American", 20.69],
  ["Southwest", 19.55], ["United", 19.46], ["Republic", 19.15],
  ["SkyWest", 19.10], ["Spirit", 17.97], ["Alaska", 15.83], ["Delta", 12.50],
] as const;

export const dataChecks = [
  { check: "Missing values", found: "1.8% of arrival fields", decision: "Drop cancelled and diverted flights" },
  { check: "Duplicate rows", found: "None found", decision: "Nothing to remove" },
  { check: "Incorrect type", found: "CRSDepTime stores an HHMM clock code", decision: "Convert to cyclic sine and cosine" },
  { check: "Invalid values", found: "67 negative durations", decision: "Drop 67 of 5.69M rows" },
  { check: "Categories", found: "No case or spelling collisions", decision: "No cleaning required" },
  { check: "Outliers", found: "9–13% flagged on delay fields", decision: "Keep them: they are the phenomenon" },
  { check: "Class balance", found: "80.5% on time / 19.5% delayed", decision: "Use ROC-AUC, F1, Recall and balanced weights" },
];

export const kmeansClusters = [
  { id: 0, name: "Long-haul, mostly steady", size: 4599, delay: -0.87, late: 18, detail: "277 min · 1,935 mi" },
  { id: 1, name: "Early short-haul pressure", size: 10222, delay: 5.03, late: 24, detail: "113 min · 579 mi" },
  { id: 2, name: "Later short-haul calm", size: 14567, delay: -1.90, late: 14, detail: "115 min · 589 mi" },
  { id: 3, name: "Severe delay pocket", size: 612, delay: 245.80, late: 100, detail: "DepDelay 249 min" },
];

export const gmmClusters = [
  { id: 0, name: "Mixed medium / long-haul", size: 6336, taxi: 15.74, delay: 9.18, late: 40 },
  { id: 1, name: "Ground-congestion delay", size: 2755, taxi: 30.71, delay: 103.58, late: 92 },
  { id: 2, name: "Later, running early", size: 11079, taxi: 16.14, delay: -8.79, late: 3 },
  { id: 3, name: "Earlier, running early", size: 9830, taxi: 15.41, delay: -7.73, late: 4 },
];

export const requirementParts = [
  [1, "Problem & dataset", "Overview"], [2, "Initial exploration", "Data"],
  [3, "Quality & cleaning", "Data"], [4, "Exploratory analysis", "Explore"],
  [5, "Feature preparation", "Data"], [6, "Data splitting", "Data"],
  [7, "Baseline models", "Models"], [8, "Model development", "Models"],
  [9, "Evaluation", "Models"], [10, "Over/underfitting", "Models"],
  [11, "Hyperparameters", "Models"], [12, "Selection", "Models"],
  [13, "Error analysis", "Errors"], [14, "Clustering", "Segments"],
  [15, "PCA", "PCA"], [16, "Insights & recommendations", "Methodology"],
  [17, "Reflection", "Methodology"],
] as const;

export const navItems = [
  ["overview", "01", "Overview"],
  ["predict", "02", "Predict"],
  ["data", "03", "Data"],
  ["explore", "04", "Explore"],
  ["models", "05", "Models"],
  ["errors", "06", "Errors"],
  ["segments", "07", "Segments"],
  ["pca", "08", "PCA"],
  ["methodology", "09", "Methodology"],
] as const;

