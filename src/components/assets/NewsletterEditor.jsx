
import React, { useState, useEffect } from "react";
import { AssetSet } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Save, Mail, Check } from "lucide-react";
import ReactQuill from 'react-quill';

export default function NewsletterEditor({ newsletter, assetSetId, selectedImageUrl }) {
  const [subject, setSubject] = useState(newsletter.subject || "");
  const [body, setBody] = useState(newsletter.body || "");
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Inject image into body if an image is selected and not already present
    // Also, ensure the effect doesn't run unnecessarily if body already contains the image
    // Adding `body` to dependencies ensures the effect re-evaluates when body changes,
    // allowing accurate check if `selectedImageUrl` is already present in the new body.
    if (selectedImageUrl && !body.includes(selectedImageUrl)) {
      const imageHtml = `<p><img src="${selectedImageUrl}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;"/></p>`;
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(body, 'text/html');
      
      const firstParagraph = doc.body.querySelector('p');
      if (firstParagraph) {
        firstParagraph.insertAdjacentHTML('afterend', imageHtml);
        setBody(doc.body.innerHTML);
      } else {
        setBody(imageHtml + body);
      }
    }
  }, [selectedImageUrl, body]);


  const handleSave = async () => {
    setIsSaving(true);
    try {
      await AssetSet.update(assetSetId, {
        newsletter: { subject, body }
      });
    } catch (error) {
      console.error("Error saving newsletter:", error);
    }
    setIsSaving(false);
  };

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
          <Button
            variant="outline"
            onClick={copyHtml}
            disabled={!subject || !body}
          >
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
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Editor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject line"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label>Newsletter Content</Label>
              <div className="border rounded-lg overflow-hidden">
                <ReactQuill
                  value={body}
                  onChange={setBody}
                  placeholder="Write your newsletter content here..."
                  style={{ minHeight: "200px" }}
                  theme="snow"
                  modules={{
                    toolbar: [
                      ['bold', 'italic', 'underline'],
                      ['link'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['clean']
                    ]
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="border rounded-lg p-4 bg-white h-[320px] overflow-y-auto">
                <div dangerouslySetInnerHTML={{ __html: body }} />
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
