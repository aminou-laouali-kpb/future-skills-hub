import { useEffect, useState } from "react";
import { Bell, BellOff, Loader2, AlertCircle, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  DEFAULT_PREFS,
  disablePush,
  enablePush,
  getPushStatus,
  loadPrefs,
  NotificationPrefs,
  PushStatus,
  savePrefs,
  sendTestPush,
} from "@/lib/pushNotifications";

export function NotificationSettings() {
  const { t, lang } = useLanguage();
  const tn = t.notifications;
  const [status, setStatus] = useState<PushStatus | null>(null);
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const s = await getPushStatus();
      if (!mounted) return;
      setStatus(s);
      if (s.state === "subscribed") {
        const p = await loadPrefs();
        if (mounted) setPrefs(p);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const subscribed = status?.state === "subscribed";

  async function handleEnable() {
    setBusy(true);
    try {
      const s = await enablePush(lang);
      setStatus(s);
      if (s.state === "subscribed") {
        const p = await loadPrefs();
        setPrefs(p);
        toast.success(tn.enabledToast);
      } else if (s.state === "denied") {
        toast.error(tn.deniedToast);
      }
    } catch (e) {
      toast.error(tn.errorToast);
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  async function handleDisable() {
    setBusy(true);
    try {
      await disablePush();
      setStatus({ state: "default" });
      toast.success(tn.disabledToast);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  async function handleSavePrefs(next: NotificationPrefs) {
    setPrefs(next);
    try {
      await savePrefs(next);
    } catch (e) {
      toast.error(tn.errorToast);
      console.error(e);
    }
  }

  async function handleTest() {
    setBusy(true);
    try {
      await sendTestPush();
      toast.success(tn.testSent);
    } catch (e) {
      toast.error(tn.errorToast);
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  if (!status) {
    return (
      <Card>
        <CardContent className="py-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> {tn.loading}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="h-4 w-4 text-primary" /> {tn.title}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{tn.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {status.state === "unsupported" && (
          <div className="flex gap-2 items-start text-sm text-muted-foreground bg-muted/40 rounded-md p-3">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{tn.unsupported}</span>
          </div>
        )}

        {status.state === "denied" && (
          <div className="flex gap-2 items-start text-sm text-destructive bg-destructive/10 rounded-md p-3">
            <BellOff className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{tn.denied}</span>
          </div>
        )}

        {(status.state === "default") && (
          <Button onClick={handleEnable} disabled={busy} className="w-full sm:w-auto">
            {busy ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Bell className="h-4 w-4 mr-2" />}
            {tn.enableCta}
          </Button>
        )}

        {subscribed && (
          <>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="np-day" className="flex-1">
                <div className="font-medium">{tn.dayPlanLabel}</div>
                <div className="text-xs text-muted-foreground">{tn.dayPlanDesc}</div>
              </Label>
              <Switch
                id="np-day"
                checked={prefs.day_plan_enabled}
                onCheckedChange={(v) => handleSavePrefs({ ...prefs, day_plan_enabled: v })}
              />
            </div>

            {prefs.day_plan_enabled && (
              <div className="flex items-center gap-3 pl-1">
                <Label htmlFor="np-time" className="text-sm">{tn.timeLabel}</Label>
                <Input
                  id="np-time"
                  type="time"
                  value={prefs.day_plan_time.slice(0, 5)}
                  onChange={(e) => handleSavePrefs({ ...prefs, day_plan_time: e.target.value })}
                  className="w-32"
                />
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="np-mentor" className="flex-1">
                <div className="font-medium">{tn.mentoringLabel}</div>
                <div className="text-xs text-muted-foreground">{tn.mentoringDesc}</div>
              </Label>
              <Switch
                id="np-mentor"
                checked={prefs.mentoring_enabled}
                onCheckedChange={(v) => handleSavePrefs({ ...prefs, mentoring_enabled: v })}
              />
            </div>

            {prefs.mentoring_enabled && (
              <div className="flex items-center gap-3 pl-1">
                <Label className="text-sm">{tn.leadLabel}</Label>
                <Select
                  value={String(prefs.mentoring_lead_minutes)}
                  onValueChange={(v) =>
                    handleSavePrefs({ ...prefs, mentoring_lead_minutes: Number(v) })
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="60">1 h</SelectItem>
                    <SelectItem value="120">2 h</SelectItem>
                    <SelectItem value="1440">{tn.oneDay}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <Button onClick={handleTest} variant="outline" size="sm" disabled={busy}>
                <Send className="h-3.5 w-3.5 mr-1.5" /> {tn.testCta}
              </Button>
              <Button onClick={handleDisable} variant="ghost" size="sm" disabled={busy}>
                <BellOff className="h-3.5 w-3.5 mr-1.5" /> {tn.disableCta}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
