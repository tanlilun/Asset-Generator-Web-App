import React, { useState, useEffect } from "react";
import { AssetSet } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Save, Mail, Check } from "lucide-react";

export default function NewsletterEditor({ newsletter, assetSetId, selectedImageUrl }) {
  const [subject, setSubject] = useState(newsletter.subject || "");
  const [headline, setHeadline] = useState(newsletter.headline || "");
  const [caption, setCaption] = useState(newsletter.caption || "");
  const [cta, setCta] = useState(newsletter.cta || "");
  const [point1, setPoint1] = useState(newsletter.point1 || "");
  const [description1, setDescription1] = useState(newsletter.description1 || "");
  const [point2, setPoint2] = useState(newsletter.point2 || "");
  const [description2, setDescription2] = useState(newsletter.description2 || "");
  const [body, setBody] = useState(newsletter.body || ""); // keep generated html here

  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Regenerate email HTML whenever inputs change
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
      await AssetSet.update(assetSetId, {
        newsletter: {
          subject,
          headline,
          caption,
          cta,
          point1,
          description1,
          point2,
          description2,
          body,
        },
      });
    } catch (error) {
      console.error("Error saving newsletter:", error);
    }
    setIsSaving(false);
  };

  // Copy HTML to clipboard including subject
  const copyHtml = async () => {
    try {
      const htmlContent = `
Subject: ${subject}
${body}
      `.trim();

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
        {/* Inputs for all fields */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Email Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject line"
                className="text-base"
              />
            </div>

            <div>
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Enter headline"
              />
            </div>

            <div>
              <Label htmlFor="caption">Image Caption</Label>
              <Input
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Enter image caption"
              />
            </div>

            <div>
              <Label htmlFor="cta">Call to Action (Button Text)</Label>
              <Input
                id="cta"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                placeholder="Enter CTA button text"
              />
            </div>

            <div>
              <Label htmlFor="point1">Point 1 Title</Label>
              <Input
                id="point1"
                value={point1}
                onChange={(e) => setPoint1(e.target.value)}
                placeholder="Enter first point title"
              />
            </div>

            <div>
              <Label htmlFor="description1">Point 1 Description</Label>
              <Input
                id="description1"
                value={description1}
                onChange={(e) => setDescription1(e.target.value)}
                placeholder="Enter first point description"
              />
            </div>

            <div>
              <Label htmlFor="point2">Point 2 Title</Label>
              <Input
                id="point2"
                value={point2}
                onChange={(e) => setPoint2(e.target.value)}
                placeholder="Enter second point title"
              />
            </div>

            <div>
              <Label htmlFor="description2">Point 2 Description</Label>
              <Input
                id="description2"
                value={description2}
                onChange={(e) => setDescription2(e.target.value)}
                placeholder="Enter second point description"
              />
            </div>
          </CardContent>
        </Card>

        {/* Live Preview */}
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
