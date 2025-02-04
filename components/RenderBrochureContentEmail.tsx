import * as React from "react";

interface BrochureContent {
  headline: string;
  tagline: string;
  overview: string;
  keyFeatures: string[];
  end: string;
  callToAction: string;
}

interface RenderBrochureContentEmailProps {
  brochureContent: BrochureContent;
}

export const RenderBrochureContentEmail = ({
  brochureContent,
}: RenderBrochureContentEmailProps) => {
  if (!brochureContent) return null;

  const { headline, tagline, overview, keyFeatures, end, callToAction } =
    brochureContent;

  const mergedKeyFeatures = [
    keyFeatures.slice(0, Math.ceil(keyFeatures.length / 2)).join(" "),
    keyFeatures.slice(Math.ceil(keyFeatures.length / 2)).join(" "),
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-blue-500 opacity-80 mb-2 text-center transition-colors">
          {headline}
        </h3>
        <p className="text-xl text-blue-500 opacity-80 italic text-center transition-colors">
          {tagline}
        </p>
      </div>
      <div>
        <h4 className="text-2xl font-semibold text-blue-500 opacity-80 mb-2 transition-colors">
          Highlights
        </h4>
        <p className="text-gray-200 text-justify">{overview}</p>
      </div>
      <div>
        <h4 className="text-2xl font-semibold text-blue-500 opacity-80 mb-2 transition-colors">
          Key Features
        </h4>
        {mergedKeyFeatures.map((paragraph, index) => (
          <p key={index} className="text-gray-200 text-justify mb-2">
            {paragraph.trim()}
          </p>
        ))}
      </div>
      <div className="text-gray-200">
        <p className="mb-4 text-justify">{end}</p>
        <p className="font-semibold text-blue-500 opacity-80 text-justify transition-colors">
          {callToAction}
        </p>
      </div>
    </div>
  );
};