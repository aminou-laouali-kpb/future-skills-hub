import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/i18n/LanguageContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Send, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Support() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message envoyé ✅" });
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="container max-w-3xl py-6 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-xl md:text-2xl font-bold">{t.support.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t.support.subtitle}</p>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <HelpCircle className="h-5 w-5 text-primary" />
          {t.support.faq}
        </h2>
        <Accordion type="single" collapsible className="space-y-2">
          {t.support.faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-xl shadow-card border px-4">
              <AccordionTrigger className="text-sm font-medium text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Contact form */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
            <MessageSquare className="h-5 w-5 text-primary" />
            {t.support.contactTitle}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">{t.support.contactSub}</p>

          <form onSubmit={handleSend} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{t.support.name}</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" required />
              </div>
              <div>
                <Label htmlFor="email">{t.support.email}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" required />
              </div>
            </div>
            <div>
              <Label htmlFor="message">{t.support.message}</Label>
              <Textarea id="message" placeholder={t.support.messagePlaceholder} value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1.5" rows={4} required />
            </div>
            <Button type="submit">
              <Send className="h-4 w-4 mr-1" /> {t.support.send}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
