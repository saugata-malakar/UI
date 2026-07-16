# DefectSpec v2.0 — RCC & Cast Concrete Diagnostic Suite

DefectSpec is a premium, interactive AI-assisted visual diagnostics application designed for concrete inspectors and structural engineers. It facilitates seamless Pre-Construction parameter verification, Post-Construction defect diagnostics, and comprehensive RCC / Defect Analyzer crack analysis.

## 🚀 Live Application

👉 **[https://ui-main-analyzer.vercel.app](https://ui-main-analyzer.vercel.app)**

---

## Key Features

1. **Unified Photo-by-Photo Classification**:
   - Every uploaded image is inspected individually across three sections: Pre-Construction, Post-Construction, and Defect Analyzer.
   - Inspectors can compare AI Interpretation profiles (with match confidence percentages) against manual drop-down select inputs.

2. **Curated Defect Dropdowns (Excel-aligned)**:
   - **Post-Construction** section dropdown contains exactly **12** curated defect types.
   - **Defect Analyzer (RCC)** section dropdown contains exactly **47** curated defect types.
   - All labels align precisely with the official project distress pattern database.

3. **Real-time Search & Sort Filters**:
   - Filter uploaded photographs by index number, parameter value, or defect label.
   - Sort images by photograph number, AI confidence level, or classification.

4. **Grouped Engineering Solutions Report**:
   - Generates compliance reports grouped by defect/risk categories.
   - Displays evidence photographs horizontally in structured galleries.
   - Details the engineering **Root Cause**, **Further Investigation** directives, and **Possible Solutions**.

5. **AI Interpretation & Manual Override**:
   - Each photo card shows the AI Interpretation alongside a manual classification selector.
   - Click **Apply AI Recommendation** or **Override AI Recommendations** to set the defect classification.
   - Defect Pattern Detected by Trained AI Expert — with probability score shown in brackets.

6. **Remediation Option Preference Selectors**:
   - Compare side-by-side remediation plans: **Option A** (Advanced structural retrofitting) vs. **Option B** (Cost-effective maintenance repair).
   - Click to select your preferred option, dynamically highlighting the card in teal with a checkmark badge (`✓ Preferred`).

7. **Interpretation Settings Page**:
   - Fully customisable defect database: edit Root Cause, Further Investigation, and Possible Solutions for each defect type.
   - Review Engineering Diagnostics and Risk Assessments directly from the settings panel.

---

## Local Development & Running

To run the application locally:
1. Clone or download the codebase.
2. In the project root, spin up a local static server:
   ```bash
   npx serve .
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your web browser.
