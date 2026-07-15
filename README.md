# DefectSpec v2.0 — RCC & Cast Concrete Diagnostic Suite

DefectSpec is a premium, interactive AI-assisted visual diagnostics application designed for concrete inspectors and structural engineers. It facilitates seamless Pre-Construction parameter verification, Post-Construction defect diagnostics, and comprehensive RCC crack analysis.

## Live Application Link
👉 **[https://ui-main-analyzer.vercel.app](https://ui-main-analyzer.vercel.app)**

---

## Key Features

1. **Unified Photo-by-Photo Classification**:
   - Every uploaded image is inspected individually.
   - Inspectors can compare AI-recommended profiles (with match confidence percentages) against manual drop-down select inputs.
   - Instantly register custom defect types using the `+` button, automatically synchronizing options across all photo selectors.

2. **Real-time Search & Sort Filters**:
   - Filter uploaded photographs by index number, parameter value, or defect label.
   - Sort images by photograph number, AI confidence level, or classification.

3. **Grouped Engineering Solutions Report**:
   - Generates compliance reports grouped by defect/risk categories.
   - Displays evidence photographs horizontally in structured galleries.
   - Details the engineering **Root Cause**, **Further Investigation** directives, and **Remediation Solutions**.

4. **Remediation Option Preference Selectors**:
   - Compare side-by-side remediation plans: **Option A** (Advanced structural retrofitting) vs. **Option B** (Cost-effective maintenance repair).
   - Click to select your preferred option, dynamically highlighting the card in teal with a checkmark badge (`✓ Preferred`).

---

## Local Development & Running

To run the application locally:
1. Clone or download the codebase.
2. In the project root, spin up a local static server:
   ```bash
   npx serve .
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your web browser.
