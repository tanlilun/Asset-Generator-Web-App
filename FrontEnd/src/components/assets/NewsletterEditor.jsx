import React, { useState, useEffect } from "react";
import { AssetSet } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Save, Mail, Check } from "lucide-react";

export default function NewsletterEditor({ assetSet, onUpdateAssetSet }) {
  const newsletter = assetSet.newsletter || {};
  const selectedImageUrl = assetSet?.selected_image_url || null;

  const [subject, setSubject] = useState(newsletter.subject || "");
  const [headline, setHeadline] = useState(newsletter.headline || "");
  const [caption, setCaption] = useState(newsletter.caption || "");
  const [cta, setCta] = useState(newsletter.cta || "");
  const [point1, setPoint1] = useState(newsletter.point1 || "");
  const [description1, setDescription1] = useState(newsletter.description1 || "");
  const [point2, setPoint2] = useState(newsletter.point2 || "");
  const [description2, setDescription2] = useState(newsletter.description2 || "");
  const [body, setBody] = useState(newsletter.body || "");

  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate newsletter body HTML
  useEffect(() => {
    const generatedHTML = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width" /></head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 30px auto; background: #fff; padding: 20px; border-radius: 8px;">
          <h1 style="color: #333;">${headline || ""}</h1>
          ${
            selectedImageUrl
              ? `<div style="margin: 16px 0;"><img src="${selectedImageUrl}" style="max-width: 100%; border-radius: 8px;" alt="Promotional image" />
                <div style="font-size: 14px; color: #666; text-align: center;">${caption || ""}</div></div>`
              : ""
          }
          ${
            cta
              ? `<div style="text-align: center; margin: 20px 0;">
                  <a href="#" style="display: inline-block; background: #6c3cc9; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">${cta}</a>
                </div>`
              : ""
          }
          ${
            point1
              ? `<div style="margin-top: 20px;">
                  <h3 style="color: #6c3cc9; margin: 0;">${point1}</h3>
                  <p style="color: #444;">${description1 || ""}</p>
                </div>`
              : ""
          }
          ${
            point2
              ? `<div style="margin-top: 20px;">
                  <h3 style="color: #6c3cc9; margin: 0;">${point2}</h3>
                  <p style="color: #444;">${description2 || ""}</p>
                </div>`
              : ""
          }
        </div>
      </body>
    </html>
    `;
    setBody(generatedHTML.trim());
  }, [
    headline,
    selectedImageUrl,
    caption,
    cta,
    point1,
    description1,
    point2,
    description2,
  ]);

  // Save handler
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedNewsletter = {
        subject,
        headline,
        caption,
        cta,
        point1,
        description1,
        point2,
        description2,
        body,
      };

      await AssetSet.update(assetSet.id, {
        newsletter: updatedNewsletter,
      });

      // Optional: sync with parent
      if (onUpdateAssetSet) {
        const updatedAssetSet = {
          ...assetSet,
          newsletter: updatedNewsletter,
        };
        onUpdateAssetSet(updatedAssetSet);
      }
    } catch (error) {
      console.error("Error saving newsletter:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Copy to clipboard
  const copyHtml = async () => {
    try {
      const htmlContent = `Subject: ${subject}\n\n${body}`;
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Mail className="w-5 h-5 text-purple-600" />
          Newsletter Content
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyHtml} disabled={!subject || !body}>
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-600" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy HTML
              </>
            )}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Fields */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Email Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: "subject", label: "Email Subject", value: subject, setter: setSubject },
              { id: "headline", label: "Headline", value: headline, setter: setHeadline },
              { id: "caption", label: "Image Caption", value: caption, setter: setCaption },
              { id: "cta", label: "Call to Action (Button Text)", value: cta, setter: setCta },
              { id: "point1", label: "Point 1 Title", value: point1, setter: setPoint1 },
              { id: "description1", label: "Point 1 Description", value: description1, setter: setDescription1 },
              { id: "point2", label: "Point 2 Title", value: point2, setter: setPoint2 },
              { id: "description2", label: "Point 2 Description", value: description2, setter: setDescription2 },
            ].map(({ id, label, value, setter }) => (
              <div key={id}>
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-white h-[600px] overflow-y-auto">
              <iframe
                title="email-preview"
                srcDoc={body}
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
