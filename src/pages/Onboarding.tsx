import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { BookOpen, ArrowRight, ArrowLeft } from "lucide-react";

export default function Onboarding() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [cohortCode, setCohortCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [level, setLevel] = useState("beginner");
  const [goal, setGoal] = useState("employment");
  const [whatsapp, setWhatsapp] = useState(false);
  const [phone, setPhone] = useState("");

  const progress = (step / totalSteps) * 100;

  const handleFinish = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 font-bold text-primary">
            <BookOpen className="h-5 w-5" />
            <span>Future Skills</span>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="bg-card rounded-2xl shadow-card p-6 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>{t.onboarding.step} {step} {t.onboarding.of} {totalSteps}</span>
          </div>
          <Progress value={progress} className="h-1.5 mb-6 [&>div]:bg-primary" />

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">{t.onboarding.step1Title}</h2>
              <div>
                <Label htmlFor="cohort">{t.onboarding.cohortCode} *</Label>
                <Input
                  id="cohort"
                  placeholder={t.onboarding.cohortPlaceholder}
                  value={cohortCode}
                  onChange={(e) => setCohortCode(e.target.value)}
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-1">{t.onboarding.cohortHelp}</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">{t.onboarding.step2Title}</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName">{t.onboarding.firstName} *</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="lastName">{t.onboarding.lastName} *</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="city">{t.onboarding.city}</Label>
                <Input id="city" placeholder={t.onboarding.cityPlaceholder} value={city} onChange={(e) => setCity(e.target.value)} className="mt-1.5" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold">{t.onboarding.step3Title}</h2>
              <div>
                <Label className="mb-2 block">{t.onboarding.level}</Label>
                <RadioGroup value={level} onValueChange={setLevel} className="flex gap-3">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner" className="font-normal">{t.onboarding.levelOptions.beginner}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate" className="font-normal">{t.onboarding.levelOptions.intermediate}</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label className="mb-2 block">{t.onboarding.goal}</Label>
                <RadioGroup value={goal} onValueChange={setGoal} className="grid grid-cols-2 gap-2">
                  {Object.entries(t.onboarding.goalOptions).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-2">
                      <RadioGroupItem value={key} id={key} />
                      <Label htmlFor={key} className="font-normal">{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Checkbox id="whatsapp" checked={whatsapp} onCheckedChange={(c) => setWhatsapp(!!c)} />
                  <Label htmlFor="whatsapp" className="font-normal text-sm">{t.onboarding.whatsapp}</Label>
                </div>
                {whatsapp && (
                  <Input
                    type="tel"
                    placeholder="+227 90 00 00 00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1.5"
                  />
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> {t.onboarding.prev}
              </Button>
            ) : <div />}
            {step < totalSteps ? (
              <Button onClick={() => setStep(step + 1)} disabled={step === 1 && !cohortCode.trim()}>
                {t.onboarding.next} <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleFinish}>
                {t.onboarding.finish} <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
