# Flight Arrival Delay Intelligence

A local, shareable web application for the Tuwaiq Machine Learning Capstone Project. It covers the complete 17-part brief: problem definition, data quality, EDA, feature preparation, splitting, baseline and advanced models, evaluation, overfitting, hyperparameters, model selection, error analysis, clustering, PCA, recommendations, and reflection.

## What is live

- Logistic Regression classification: probability of arrival delay of 15 minutes or more.
- Linear Regression: predicted arrival delay in minutes.
- Model coefficients and preprocessing statistics are retrained from the project dataset using the exact notebook methodology: random state 42, a stratified 30,000-row sample, and a 60/20/20 split.
- All other sections use the exact notebook/report results.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Share with 2–3 friends on the same Wi-Fi

```bash
npm run share
```

Find your Mac's local IP address in System Settings → Wi-Fi → Details → TCP/IP. Friends on the same network can open:

```text
http://YOUR-LOCAL-IP:3000
```

Keep the terminal window open while they use the app. If macOS asks whether to allow incoming connections, choose Allow.

## Validate

```bash
npm run build
npm test
```

## Prediction boundary

The app uses actual `TaxiOut`, matching the notebook feature set. Therefore it describes the product as a post-departure, wheels-off update—not a pre-departure forecast.

