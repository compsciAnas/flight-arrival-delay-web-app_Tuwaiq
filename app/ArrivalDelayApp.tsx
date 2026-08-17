"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import {
  airlineRates,
  classificationModels,
  dataChecks,
  dayDelay,
  gmmClusters,
  kmeansClusters,
  monthDelay,
  navItems,
  regressionModels,
  requirementParts,
} from "./data";
import {
  ModelArtifact,
  PredictionInput,
  PredictionResult,
  runPrediction,
} from "./model";

type ViewId = (typeof navItems)[number][0];

const DEFAULT_INPUT: PredictionInput = {
  airline: "Delta Air Lines Inc.",
  origin: "ATL",
  destination: "JFK",
  flightDate: "2018-08-15",
  scheduledDeparture: "14:30",
  departureDelay: 28,
  taxiOut: 21,
  scheduledDuration: 155,
};

function Dot({ tone = "aqua" }: { tone?: "aqua" | "orange" | "purple" }) {
  return <span className={`dot dot-${tone}`} aria-hidden="true" />;
}

function PageHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <header className="page-heading">
      <p className="eyebrow"><Dot />{eyebrow}</p>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}

function Metric({ value, label, tone = "aqua" }: { value: string; label: string; tone?: "aqua" | "orange" | "purple" }) {
  return (
    <article className="metric-card">
      <Dot tone={tone} />
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

function Insight({ children }: { children: ReactNode }) {
  return <div className="insight-strip"><Dot tone="orange" /><strong>{children}</strong></div>;
}

function HorizontalBars({
  data,
  max,
  suffix = "",
  color = "blue",
}: {
  data: readonly (readonly [string, number])[];
  max: number;
  suffix?: string;
  color?: "blue" | "purple" | "orange";
}) {
  return (
    <div className="bar-list">
      {data.map(([label, value]) => (
        <div className="bar-row" key={label}>
          <div className="bar-meta"><span>{label}</span><strong>{value.toFixed(2)}{suffix}</strong></div>
          <div className="bar-track" role="img" aria-label={`${label}: ${value.toFixed(2)}${suffix}`}>
            <span className={`bar-fill bar-${color}`} style={{ width: `${Math.max(2, (value / max) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Overview({ navigate }: { navigate: (view: ViewId) => void }) {
  return (
    <section className="view overview-view">
      <div className="hero-orbit orbit-one" aria-hidden="true" />
      <div className="hero-orbit orbit-two" aria-hidden="true" />
      <div className="hero-copy">
        <p className="hero-kicker">MACHINE LEARNING CAPSTONE · 2018 US FLIGHTS</p>
        <h1>Flight Arrival<br />Delay Intelligence</h1>
        <p className="hero-lede">A clear, model-backed update on whether a flight will arrive 15+ minutes late — and how many minutes early or late it is expected to be.</p>
        <div className="hero-actions">
          <button className="button button-primary" onClick={() => navigate("predict")}>Predict a flight</button>
          <button className="button button-secondary" onClick={() => navigate("methodology")}>See the methodology</button>
        </div>
      </div>

      <div className="metric-grid hero-metrics">
        <Metric value="5.69M" label="raw flight records" />
        <Metric value="12" label="models compared" tone="orange" />
        <Metric value="96.49%" label="test ROC-AUC" />
        <Metric value="7.29 min" label="mean absolute error" tone="orange" />
      </div>

      <div className="overview-split">
        <article className="soft-card question-card">
          <div><Dot /><h2>Classification</h2></div>
          <p>Will the flight land 15 minutes late or more?</p>
          <strong>Logistic Regression · ROC-AUC 96.49%</strong>
        </article>
        <article className="soft-card question-card">
          <div><Dot tone="orange" /><h2>Regression</h2></div>
          <p>How many minutes early or late will it arrive?</p>
          <strong>Linear Regression · R² 95.79%</strong>
        </article>
      </div>

      <Insight>The product is a post-departure, wheels-off update because actual TaxiOut is part of the approved feature set.</Insight>
      <footer className="team-line">Khalid Al Dosari · Abdulaziz Alshareef · Anas Alzahrani · Feras Madkhali <span>Tuwaiq Bootcamp</span></footer>
    </section>
  );
}

function Predict({ artifact }: { artifact: ModelArtifact | null }) {
  const [form, setForm] = useState<PredictionInput>(DEFAULT_INPUT);
  const [submittedResult, setSubmittedResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState("");
  const result = useMemo(
    () => submittedResult ?? (artifact ? runPrediction(artifact, DEFAULT_INPUT) : null),
    [artifact, submittedResult],
  );

  function update<K extends keyof PredictionInput>(key: K, value: PredictionInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!artifact) return;
    try {
      setError("");
      setSubmittedResult(runPrediction(artifact, form));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Check the flight details.");
    }
  }

  const probability = result ? Math.round(result.probability * 100) : 0;
  const delayText = result
    ? result.predictedDelay >= 0
      ? `${Math.round(result.predictedDelay)} min late`
      : `${Math.abs(Math.round(result.predictedDelay))} min early`
    : "—";

  return (
    <section className="view">
      <PageHeading eyebrow="Live model demo" title="Predict one flight" subtitle="Enter information known at wheels-off. Both selected models run locally in your browser using the trained coefficients from the notebook." />
      <div className="scope-note"><Dot tone="orange" /><div><strong>Prediction boundary</strong><p>Actual TaxiOut is required, so this is a wheels-off update. It is not a pre-departure forecast.</p></div></div>

      <div className="prediction-layout">
        <form className="form-card" onSubmit={submit}>
          <div className="section-title"><span>Flight details</span><button type="button" className="text-button" onClick={() => setForm(DEFAULT_INPUT)}>Load example</button></div>
          <div className="form-grid">
            <label className="field field-wide"><span>Airline</span>
              <select value={form.airline} onChange={(event) => update("airline", event.target.value)} disabled={!artifact}>
                {(artifact?.options.airlines ?? [DEFAULT_INPUT.airline]).map((airline) => <option key={airline}>{airline}</option>)}
              </select>
            </label>
            <label className="field"><span>Origin</span><input list="origin-options" value={form.origin} onChange={(event) => update("origin", event.target.value.toUpperCase())} maxLength={3} /></label>
            <label className="field"><span>Destination</span><input list="destination-options" value={form.destination} onChange={(event) => update("destination", event.target.value.toUpperCase())} maxLength={3} /></label>
            <datalist id="origin-options">{artifact?.options.origins.map((item) => <option key={item} value={item} />)}</datalist>
            <datalist id="destination-options">{artifact?.options.destinations.map((item) => <option key={item} value={item} />)}</datalist>
            <label className="field"><span>Flight date</span><input type="date" value={form.flightDate} onChange={(event) => update("flightDate", event.target.value)} /></label>
            <label className="field"><span>Scheduled departure</span><input type="time" value={form.scheduledDeparture} onChange={(event) => update("scheduledDeparture", event.target.value)} /></label>
            <label className="field"><span>Departure delay (min)</span><input type="number" min="-60" max="1200" value={form.departureDelay} onChange={(event) => update("departureDelay", Number(event.target.value))} /></label>
            <label className="field"><span>Taxi-out (min)</span><input type="number" min="0" max="300" value={form.taxiOut} onChange={(event) => update("taxiOut", Number(event.target.value))} /></label>
            <label className="field field-wide"><span>Scheduled flight duration (min)</span><input type="number" min="15" max="900" value={form.scheduledDuration} onChange={(event) => update("scheduledDuration", Number(event.target.value))} /></label>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary button-full" type="submit" disabled={!artifact}>{artifact ? "Run prediction" : "Loading trained model…"}</button>
        </form>

        <div className="result-stack" aria-live="polite">
          <article className="result-card classification-result">
            <div className="result-topline"><span><Dot />Classification</span><span className={`risk-badge risk-${result?.risk.toLowerCase() ?? "low"}`}>{result?.risk ?? "Waiting"}</span></div>
            <div className="probability-layout">
              <div className="probability-ring" style={{ background: `conic-gradient(var(--purple) ${probability}%, var(--lavender) 0)` }}><span>{probability}%</span></div>
              <div><h2>{result && result.probability >= 0.5 ? "Likely delayed 15+" : "Likely under 15 min"}</h2><p>Decision threshold: 50%. ROC-AUC is the primary evaluation metric.</p></div>
            </div>
          </article>
          <article className="result-card regression-result">
            <div className="result-topline"><span><Dot tone="orange" />Regression</span><span>MAE ±7.29 min</span></div>
            <div className="delay-result"><strong>{delayText}</strong><div><span>Updated arrival</span><b>{result?.updatedArrival ?? "—"}</b></div></div>
            <p>Typical absolute error is 7.29 minutes; this is an error reference, not a formal confidence interval.</p>
          </article>
          <article className="drivers-card">
            <h2>What moved this prediction</h2>
            {result?.contributions.map((item) => (
              <div className="driver-row" key={item.key}>
                <span>{item.label}</span><strong className={item.value >= 0 ? "raises" : "lowers"}>{item.value >= 0 ? "Raises risk" : "Lowers risk"}</strong>
              </div>
            )) ?? <p>Run a prediction to see the strongest model contributions.</p>}
          </article>
        </div>
      </div>
    </section>
  );
}

function DataView() {
  return (
    <section className="view">
      <PageHeading eyebrow="Parts 1–3, 5–6" title="The data, prepared defensibly" subtitle="Every row is one scheduled US domestic flight. Cleaning and splitting decisions are shown with the reason they were made." />
      <div className="metric-grid">
        <Metric value="5,689,512" label="rows in raw file" />
        <Metric value="61" label="columns before selection" tone="orange" />
        <Metric value="5,578,560" label="rows after cleaning" />
        <Metric value="30,000" label="rows modelled" tone="orange" />
      </div>
      <div className="table-card">
        <div className="table-title"><div><Dot /><h2>Seven checks and seven decisions</h2></div><span>Decision matters more than method</span></div>
        <div className="data-table" role="table" aria-label="Data quality checks">
          <div className="data-row data-header" role="row"><span>Check</span><span>What we found</span><span>Decision</span></div>
          {dataChecks.map((row, index) => <div className="data-row" role="row" key={row.check}><span><b>{String(index + 1).padStart(2, "0")}</b>{row.check}</span><span>{row.found}</span><strong>{row.decision}</strong></div>)}
        </div>
      </div>
      <div className="two-col">
        <article className="soft-card"><h2><Dot />Legal at wheels-off</h2><p>DepDelay, TaxiOut, CRSElapsedTime, scheduled time, Month, DayofMonth, DayOfWeek, Airline, Origin and Dest.</p></article>
        <article className="soft-card"><h2><Dot tone="orange" />Banned after landing</h2><p>ArrTime, WheelsOn, TaxiIn, ActualElapsedTime, AirTime, ArrDelayMinutes, ArrivalDelayGroups and DivAirportLandings.</p></article>
      </div>
      <div className="split-flow">
        <div><span>60%</span><strong>Train</strong><small>18,000 rows</small></div>
        <div><span>20%</span><strong>Validation</strong><small>6,000 rows</small></div>
        <div><span>20%</span><strong>Test</strong><small>6,000 rows · evaluated once</small></div>
      </div>
      <Insight>The split is stratified on ArrDel15, preserving the 19.5% delay rate in every partition.</Insight>
    </section>
  );
}

function Explore() {
  const dayMax = Math.max(...dayDelay.map(([, value]) => value));
  const monthMax = Math.max(...monthDelay);
  return (
    <section className="view">
      <PageHeading eyebrow="Part 4 · Exploratory analysis" title="Five findings shaped the model" subtitle="The interface turns the notebook’s EDA into concise, interpretable evidence rather than a gallery of plots." />
      <div className="feature-story">
        <article className="story-lead"><span>0.96</span><div><h2>Departure delay dominates</h2><p>DepDelay is almost the whole problem. It creates a strong post-departure model and also sets the ceiling on what it can learn.</p></div></article>
        <article className="story-stat"><Dot tone="orange" /><strong>0.22</strong><span>TaxiOut → ArrDelay</span></article>
        <article className="story-stat"><Dot /><strong>-0.02</strong><span>Distance → ArrDelay</span></article>
      </div>
      <div className="chart-grid">
        <article className="chart-card"><div className="chart-heading"><h2>Friday is worst; Saturday is calmest</h2><span>Mean arrival delay by day</span></div><HorizontalBars data={dayDelay} max={dayMax} suffix=" min" /></article>
        <article className="chart-card"><div className="chart-heading"><h2>Summer carries a clear signal</h2><span>Mean arrival delay by month</span></div><div className="column-chart" aria-label="Mean arrival delay by month">{monthDelay.map((value, index) => <div key={index}><span style={{ height: `${(value / monthMax) * 100}%` }} /><small>{index + 1}</small></div>)}</div></article>
      </div>
      <article className="chart-card"><div className="chart-heading"><h2>Carriers are not equal</h2><span>Delay rate among the ten largest carriers</span></div><HorizontalBars data={airlineRates} max={30} suffix="%" /></article>
      <div className="insight-grid">
        {["Delay compounds through the day: about -3 min at 5am to +12 min around 6pm.", "August averages 11.51 min; September and October are near 3 min.", "JetBlue’s 27.31% delay rate is more than twice Delta’s 12.50%.", "Distance and scheduled duration duplicate each other but barely explain lateness."].map((text, index) => <article key={text}><span>{String(index + 2).padStart(2, "0")}</span><p>{text}</p></article>)}
      </div>
    </section>
  );
}

function Models() {
  return (
    <section className="view">
      <PageHeading eyebrow="Parts 7–12" title="Simple models won" subtitle="Six algorithms were compared for each target on one shared split. Selection combined performance, generalization, interpretability and computational cost." />
      <div className="selected-models">
        <article><Dot /><div><span>Selected classifier</span><h2>Logistic Regression</h2><p>Best test ROC-AUC, smallest gap, fast training and readable coefficients.</p></div><strong>96.49%</strong></article>
        <article><Dot tone="orange" /><div><span>Selected regressor</span><h2>Linear Regression</h2><p>Best test R² and MAE; extra flexibility did not improve generalization.</p></div><strong>95.79%</strong></article>
      </div>
      <div className="model-tables">
        <article className="table-card compact-table"><div className="table-title"><div><Dot /><h2>Classification</h2></div><span>Test ROC-AUC</span></div>{classificationModels.map((model) => <div className={`model-row ${model.selected ? "selected" : ""}`} key={model.name}><span>{model.name}{model.selected && <em>Selected</em>}</span><div className="mini-track"><i style={{ width: `${Math.max(0, (model.test - 0.85) / 0.15) * 100}%` }} /></div><strong>{(model.test * 100).toFixed(2)}%</strong></div>)}</article>
        <article className="table-card compact-table"><div className="table-title"><div><Dot tone="orange" /><h2>Regression</h2></div><span>Test R²</span></div>{regressionModels.map((model) => <div className={`model-row ${model.selected ? "selected" : ""}`} key={model.name}><span>{model.name}{model.selected && <em>Selected</em>}</span><div className="mini-track"><i style={{ width: `${model.r2 * 100}%` }} /></div><strong>{(model.r2 * 100).toFixed(2)}%</strong></div>)}</article>
      </div>
      <div className="metric-grid model-metrics">
        <Metric value="92.43%" label="classification accuracy" />
        <Metric value="89.31%" label="delayed-class recall" tone="orange" />
        <Metric value="82.14%" label="delayed-class F1" />
        <Metric value="10.35 min" label="regression RMSE" tone="orange" />
      </div>
      <article className="experiment-card">
        <div className="table-title"><div><Dot /><h2>Complexity rises; validation peaks</h2></div><span>Four hyperparameter experiments</span></div>
        <div className="experiment-grid">
          <div><span>KNN · neighbors</span><strong>k = 50</strong><p>k=1 memorized training: 1.000 train vs 0.707 validation.</p></div>
          <div><span>Decision Tree · depth</span><strong>depth = 6</strong><p>Validation peaked near depth 4, then fell as training kept rising.</p></div>
          <div><span>XGBoost · learning rate</span><strong>rate = 0.03</strong><p>Validation peaked at 0.961; larger steps widened the gap.</p></div>
          <div><span>SVM · C</span><strong>C = 1</strong><p>Beyond C=1, validation fell while train AUC reached 1.000.</p></div>
        </div>
      </article>
      <Insight>The strongest model is the one that generalizes and fits the deployment — not the most sophisticated algorithm.</Insight>
    </section>
  );
}

function Errors() {
  const matrix = [[4502, 329], [125, 1044]];
  const residuals = [["On time", -2.57], ["0–15 min", 4.45], ["15–60 min", 5.69], ["60–200 min", 5.17], ["200+ min", 4.00]] as const;
  return (
    <section className="view">
      <PageHeading eyebrow="Part 13 · Error analysis" title="The failures reveal the boundary" subtitle="Classification misses mostly arise after takeoff; regression systematically softens the severity of delays already underway." />
      <div className="error-grid">
        <article className="matrix-card"><div className="chart-heading"><h2>Confusion matrix</h2><span>6,000-row final test set</span></div><div className="matrix"><span className="axis-y">Actual</span>{matrix.flatMap((row, r) => row.map((value, c) => <div className={`matrix-cell matrix-${r}-${c}`} key={`${r}-${c}`}><strong>{value.toLocaleString()}</strong><small>{r === 0 ? "On time" : "Delayed"} → {c === 0 ? "On time" : "Delayed"}</small></div>))}<span className="axis-x">Predicted</span></div></article>
        <div className="error-findings">
          <article><Dot tone="orange" /><div><h2>125 false negatives</h2><p>Mean DepDelay is only 0.15 min. They left on time and lost time in the air, beyond the current feature set.</p></div></article>
          <article><Dot /><div><h2>329 false positives</h2><p>Mean DepDelay is 12.3 min and TaxiOut 22.6 min. They looked risky, then recovered en route.</p></div></article>
        </div>
      </div>
      <article className="chart-card"><div className="chart-heading"><h2>Residuals lean one way</h2><span>Actual minus predicted arrival delay</span></div><div className="residual-chart">{residuals.map(([label, value]) => <div key={label}><span>{label}</span><div className="residual-axis"><i className={value >= 0 ? "positive" : "negative"} style={{ width: `${Math.abs(value) * 12}%` }} /></div><strong>{value > 0 ? "+" : ""}{value.toFixed(2)} min</strong></div>)}</div></article>
      <div className="three-findings">
        <article><span>01</span><h2>Misses start on time</h2><p>False negatives are the in-air blind spot, not simple threshold failures.</p></article>
        <article><span>02</span><h2>False alarms are borderline</h2><p>They carry credible risk signals and later recover time.</p></article>
        <article><span>03</span><h2>Severity is softened</h2><p>Every delayed bucket is underpredicted by roughly 4–6 minutes.</p></article>
      </div>
      <Insight>False negatives matter more operationally, supporting balanced class weights and strong Recall on delayed flights.</Insight>
    </section>
  );
}

function Segments() {
  return (
    <section className="view">
      <PageHeading eyebrow="Part 14 · Unsupervised learning" title="Two algorithms find a severe segment" subtitle="K-Means and GMM use six standardized flight-shape features. ArrDelay and ArrDel15 are excluded from clustering and used only afterward to profile the groups." />
      <div className="segment-summary"><article><Dot /><span>K-Means</span><strong>k = 4</strong><p>Silhouette 0.286; chosen for interpretability rather than the k=2 maximum.</p></article><article><Dot tone="orange" /><span>Gaussian Mixture</span><strong>k = 4</strong><p>BIC kept falling through k=8; four components keep comparison readable.</p></article></div>
      <h2 className="section-heading">K-Means profiles</h2>
      <div className="cluster-grid">{kmeansClusters.map((cluster) => <article className={cluster.id === 3 ? "severe" : ""} key={cluster.id}><div><span>Cluster {cluster.id}</span><b>{cluster.size.toLocaleString()} flights</b></div><h3>{cluster.name}</h3><p>{cluster.detail}</p><div className="cluster-stats"><strong>{cluster.delay > 0 ? "+" : ""}{cluster.delay.toFixed(1)} min</strong><span>{cluster.late}% delayed</span></div></article>)}</div>
      <h2 className="section-heading">GMM profiles</h2>
      <div className="cluster-grid">{gmmClusters.map((cluster) => <article className={cluster.id === 1 ? "severe" : ""} key={cluster.id}><div><span>Cluster {cluster.id}</span><b>{cluster.size.toLocaleString()} flights</b></div><h3>{cluster.name}</h3><p>TaxiOut {cluster.taxi.toFixed(1)} min</p><div className="cluster-stats"><strong>{cluster.delay > 0 ? "+" : ""}{cluster.delay.toFixed(1)} min</strong><span>{cluster.late}% delayed</span></div></article>)}</div>
      <Insight>K-Means anchors its severe group on total ground delay; GMM anchors a broader severe group on congestion. Their partial agreement is the useful result.</Insight>
    </section>
  );
}

function PCAView() {
  return (
    <section className="view">
      <PageHeading eyebrow="Part 15 · Dimensionality reduction" title="220 features become 44" subtitle="PCA preserves 90.03% of the variance with one fifth of the encoded columns while changing ROC-AUC by only 0.09 percentage points." />
      <div className="pca-hero"><div><span>Original</span><strong>220</strong><small>encoded features</small></div><div className="pca-arrow"><i /><span>5× smaller</span></div><div><span>Reduced</span><strong>44</strong><small>principal components</small></div></div>
      <div className="pca-metrics"><article><Dot /><span>Variance retained</span><strong>90.03%</strong><div className="progress"><i style={{ width: "90.03%" }} /></div></article><article><Dot tone="orange" /><span>ROC-AUC without PCA</span><strong>96.49%</strong><div className="progress"><i style={{ width: "96.49%" }} /></div></article><article><Dot /><span>ROC-AUC with PCA</span><strong>96.40%</strong><div className="progress"><i style={{ width: "96.40%" }} /></div></article></div>
      <div className="two-col pca-notes"><article className="soft-card"><h2>Where PCA helps</h2><p>Compression for slower algorithms, smaller stored representations, and deployments where feature count matters.</p></article><article className="soft-card"><h2>Why it is not deployed here</h2><p>Logistic Regression already handles 220 features without serious overfitting, and original features are easier to explain.</p></article></div>
      <Insight>PCA is useful as compression here, not as an accuracy improvement.</Insight>
    </section>
  );
}

function Methodology() {
  return (
    <section className="view">
      <PageHeading eyebrow="Parts 16–17 · Complete coverage" title="The framing is the model" subtitle="The application keeps every capstone requirement visible and separates the deployable prediction from the analytical evidence around it." />
      <div className="method-callout"><div><span>Most important finding</span><h2>Departure delay enables the model — and bounds it.</h2><p>The 0.96 relationship explains both the strong result and the in-air failures the current data cannot observe.</p></div><strong>0.96</strong></div>
      <div className="recommendations"><article><span>1</span><div><h3>Use it for post-departure updates</h3><p>Passenger communication, gate planning and connection management.</p></div></article><article><span>2</span><div><h3>Do not use it before departure</h3><p>That is a different, harder problem requiring a different feature boundary.</p></div></article><article><span>3</span><div><h3>Add weather and air-traffic context</h3><p>Those signals directly target the in-air blind spot found in error analysis.</p></div></article><article><span>4</span><div><h3>Retrain the linear models on full data</h3><p>The 30,000-row capstone sample kept SVM comparisons fair; deployment does not need that constraint.</p></div></article></div>
      <div className="coverage-card"><div className="table-title"><div><Dot /><h2>Capstone coverage map</h2></div><span>17 of 17 parts represented</span></div><div className="coverage-grid">{requirementParts.map(([part, label, location]) => <article key={part}><span>{String(part).padStart(2, "0")}</span><div><strong>{label}</strong><small>{location}</small></div><b aria-label="Covered">✓</b></article>)}</div></div>
      <div className="reflection-grid"><article><span>Hardest</span><p>Defining exactly when “now” occurs and whether TaxiOut is legally available.</p></article><article><span>Most surprising</span><p>The linear baselines matched or beat more complex models.</p></article><article><span>Next iteration</span><p>Build a strict pre-departure model side by side and test on a later year.</p></article></div>
      <Insight>Real-world recommendation: yes for a wheels-off update; no for decisions that must be made before departure.</Insight>
    </section>
  );
}

export default function ArrivalDelayApp() {
  const [view, setView] = useState<ViewId>("overview");
  const [artifact, setArtifact] = useState<ModelArtifact | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    fetch("/model-artifact.json")
      .then((response) => {
        if (!response.ok) throw new Error("Model artifact unavailable");
        return response.json();
      })
      .then((data: ModelArtifact) => setArtifact(data))
      .catch(() => setLoadError(true));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  const content = useMemo(() => {
    switch (view) {
      case "predict": return <Predict artifact={artifact} />;
      case "data": return <DataView />;
      case "explore": return <Explore />;
      case "models": return <Models />;
      case "errors": return <Errors />;
      case "segments": return <Segments />;
      case "pca": return <PCAView />;
      case "methodology": return <Methodology />;
      default: return <Overview navigate={setView} />;
    }
  }, [artifact, view]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setView("overview")} aria-label="Flight Arrival Delay home"><span>AD</span><div><strong>Arrival Delay</strong><small>ML Capstone</small></div></button>
        <nav aria-label="Project sections">{navItems.map(([id, number, label]) => <button key={id} className={view === id ? "active" : ""} aria-current={view === id ? "page" : undefined} onClick={() => setView(id)}><span>{number}</span>{label}</button>)}</nav>
        <div className="model-status"><span className={loadError ? "status-error" : artifact ? "status-ready" : "status-loading"} /><div><strong>{loadError ? "Model unavailable" : artifact ? "Models ready" : "Loading models"}</strong><small>{artifact?.version ?? "Local browser inference"}</small></div></div>
      </aside>
      <header className="mobile-header"><button className="brand" onClick={() => setView("overview")}><span>AD</span><div><strong>Arrival Delay</strong><small>ML Capstone</small></div></button></header>
      <nav className="mobile-nav" aria-label="Project sections">{navItems.map(([id, number, label]) => <button key={id} className={view === id ? "active" : ""} onClick={() => setView(id)}><span>{number}</span>{label}</button>)}</nav>
      <main>{content}</main>
    </div>
  );
}
