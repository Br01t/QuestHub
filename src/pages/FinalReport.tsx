import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function FinalReport() {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState<string>("");
  const [siteName, setSiteName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    const savedData = localStorage.getItem("selectedCompanyData");
    const user = localStorage.getItem("userProfileData");

    if (savedData) {
      const parsed = JSON.parse(savedData);
      setCompanyName(parsed.companyName || "");
      setSiteName(parsed.siteName || "");
    }

    if (user) {
      const parsedUser = JSON.parse(user);
      setUserName(parsedUser.email || parsedUser.displayName || "");
    }
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(16);
    doc.text("Relazione finale - Valutazione VDT", 14, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Azienda: ${companyName}`, 14, y);
    y += 6;
    doc.text(`Sede: ${siteName}`, 14, y);
    y += 6;
    doc.text(`Compilato da: ${userName}`, 14, y);
    y += 10;

    doc.setFontSize(13);
    doc.text("Corpo della relazione:", 14, y);
    y += 6;

    const bodyText =
      "La presente relazione riassume i risultati emersi dal questionario di valutazione dei rischi relativi all’uso di videoterminali (VDT). I dati raccolti hanno consentito di individuare gli aspetti ergonomici, ambientali e organizzativi rilevanti ai fini della salute e sicurezza dei lavoratori.";

    doc.setFontSize(11);
    const splitBody = doc.splitTextToSize(bodyText, 180);
    doc.text(splitBody, 14, y);
    y += splitBody.length * 6 + 10;

    doc.setFontSize(13);
    doc.text("Note conclusive:", 14, y);
    y += 6;
    doc.setFontSize(11);
    const splitNotes = doc.splitTextToSize(notes || "—", 180);
    doc.text(splitNotes, 14, y);

    y += splitNotes.length * 6 + 10;
    doc.setFontSize(9);
    doc.text(
      `Generato automaticamente il ${new Date().toLocaleDateString()}`,
      14,
      y
    );

    doc.save(`Relazione_${companyName}_${siteName}.pdf`);
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Relazione finale</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p><strong>Azienda:</strong> {companyName || "—"}</p>
            <p><strong>Sede:</strong> {siteName || "—"}</p>
            <p><strong>Compilato da:</strong> {userName || "—"}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Corpo della relazione</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La presente relazione riassume i risultati emersi dal questionario
              di valutazione dei rischi relativi all’uso di videoterminali (VDT).
              I dati raccolti hanno consentito di individuare gli aspetti ergonomici,
              ambientali e organizzativi rilevanti ai fini della salute e sicurezza
              dei lavoratori.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Note conclusive</h3>
            <Textarea
              placeholder="Aggiungi eventuali osservazioni finali..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              ← Torna indietro
            </Button>
            <Button onClick={generatePDF}>Esporta Relazione PDF</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}