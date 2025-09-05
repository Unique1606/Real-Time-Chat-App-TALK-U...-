/*const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-primary/10 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;*/
import { Twitter, Youtube, Linkedin, Github, Mail } from "lucide-react";
import { Code2 } from "lucide-react"; // Using Code2 as a clean icon for LeetCode

const AuthImagePattern = ({ title, subtitle }) => {
  // social icons with links
  const socialLinks = [
    { Icon: Mail, url: "mailto:ravindraraghu556@gmail.com" }, // Gmail
    { Icon: Twitter, url: "https://twitter.com/Batman_16_6" }, // Twitter (X)
    { Icon: Code2, url: "https://leetcode.com/u/RAVINDRANATH_V/" }, // LeetCode
    { Icon: Youtube, url: "https://youtube.com/yourchannel" }, // YouTube (replace with your actual channel)
    { Icon: Linkedin, url: "https://www.linkedin.com/in/ravindranathvadde" }, // LinkedIn
    { Icon: Github, url: "https://github.com/Unique1606" }, // GitHub
  ];

  // 3 copyright/branding blocks
  const branding = ["© 2025", "By Ravindra", "🦇 Batman"];

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {/* Social icons with links */}
          {socialLinks.map(({ Icon, url }, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`aspect-square flex items-center justify-center rounded-2xl bg-primary/10 hover:bg-primary/20 transition ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            >
              <Icon className="w-6 h-6 text-primary" />
            </a>
          ))}

          {/* Branding */}
          {branding.map((text, i) => (
            <div
              key={`brand-${i}`}
              className="aspect-square flex items-center justify-center rounded-2xl bg-primary/20 text-xs font-semibold text-primary uppercase tracking-wide"
            >
              {text}
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
