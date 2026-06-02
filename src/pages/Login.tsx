import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, ArrowRight } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { toast } from "@/hooks/use-toast";
import { MOCK_DEMO_OTP } from "@/lib/supabase";

export default function Login() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, isMockMode } = useAuth();
  const [step, setStep] = useState<"contact" | "otp">("contact");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;
    setBusy(true);
    try {
      await sendOtp(contact);
      setStep("otp");
      toast({
        title: t.auth.codeSent,
        description: t.auth.codeSentTo.replace("{contact}", contact),
      });
    } catch {
      toast({ title: t.common.error, description: t.auth.sendFailed, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length < 6) return;
    setBusy(true);
    try {
      const p = await verifyOtp(contact, otp);
      navigate(p?.onboardingCompleted ? "/dashboard" : "/onboarding");
    } catch {
      toast({ title: t.common.error, description: t.auth.invalidOtp, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    setBusy(true);
    try {
      await sendOtp(contact);
      toast({ title: t.auth.codeSent });
    } catch {
      toast({ title: t.common.error, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 font-bold text-primary">
            <BookOpen className="h-5 w-5" />
            <span>Future Skills</span>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="bg-card rounded-2xl shadow-card p-6 animate-fade-in">
          {step === "contact" ? (
            <form onSubmit={handleSendCode}>
              <h1 className="text-xl font-bold mb-1">{t.auth.title}</h1>
              <p className="text-sm text-muted-foreground mb-6">{t.auth.subtitle}</p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="contact">{t.auth.emailPhone}</Label>
                  <Input
                    id="contact"
                    type="text"
                    placeholder={t.auth.emailPhonePlaceholder}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                {isMockMode && (
                  <p className="text-xs text-muted-foreground rounded-lg bg-muted p-2">
                    {t.auth.demoOtpHint.replace("{code}", MOCK_DEMO_OTP)}
                  </p>
                )}
                <Button type="submit" className="w-full h-11" disabled={busy}>
                  {t.auth.sendCode} <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </form>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => setStep("contact")}
                className="text-xs text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
              >
                ← {t.auth.back}
              </button>
              <h1 className="text-xl font-bold mb-1">{t.auth.otpTitle}</h1>
              <p className="text-sm text-muted-foreground mb-6">
                {t.auth.otpSub} <span className="font-medium text-foreground">{contact}</span>
              </p>

              <div className="flex justify-center mb-6">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button onClick={handleVerify} className="w-full h-11" disabled={otp.length < 6 || busy}>
                {t.auth.verify} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>

              <button
                type="button"
                onClick={handleResend}
                disabled={busy}
                className="w-full text-center text-xs text-muted-foreground hover:text-primary mt-4 transition-colors disabled:opacity-50"
              >
                {t.auth.resend}
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          {t.auth.noAccount}{" "}
          <button type="button" onClick={() => navigate("/onboarding")} className="text-primary hover:underline font-medium">
            {t.auth.register}
          </button>
        </p>
      </div>
    </div>
  );
}
