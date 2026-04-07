class TaxAdvisor:
    def __init__(self):
        # Constants for Indian Tax brackets and commonly forgotten deductions
        self.DEDUCTIONS_80C_LIMIT = 150000
        self.DEDUCTIONS_80D_LIMIT = 25000 # Self/Family
        
    def analyze_document_and_suggest(self, extracted_text: str, document_type: str = "payslip"):
        """Analyzes text extracted from payslip or Form 16 and suggests tax saving strategies."""
        text = extracted_text.lower()
        suggestions = []
        
        # 1. Invested in 80C?
        if "80c" not in text and "elss" not in text and "ppf" not in text:
            suggestions.append("🌟 **80C Maximization**: I don't see any 80C investments like ELSS or PPF. You can save up to ₹46,800 in tax by investing the full ₹1.5L limit.")
            
        # 2. Health Insurance (80D)
        if "medical insurance" not in text and "health insurance" not in text and "80d" not in text:
            suggestions.append("🏥 **Health Insurance (80D)**: Consider a health policy for yourself and your parents; it's a double win - protection + extra tax deductions up to ₹75,000!")
            
        # 3. Rent & HRA
        if "rent" not in text and "hra" in text:
            suggestions.append("🏠 **HRA Optimization**: Make sure you're submitting valid rent receipts; if you're not claiming HRA, this could be a big missed opportunity!")

        # 4. NPS (80CCD(1B))
        if "nps" not in text:
            suggestions.append("📈 **Extra ₹50k Savings**: Look into the National Pension System (NPS). An extra ₹50,000 deduction is available under Section 80CCD(1B) beyond the 80C limit.")

        # 5. Food Coupons / Sodexo
        if "meal coupons" not in text and "food allowance" not in text:
             suggestions.append("🥗 **Meal Allowances**: Check if your company offers food coupons. These are tax-free up to ₹50 per meal!")

        if not suggestions:
            return ["Your current tax planning looks solid based on this document! 🌟 Continue regular audits to stay efficient."]
            
        return suggestions

tax_advisor = TaxAdvisor()
