import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";

const Footer = () => {
  return (
    <div>
      <footer className="bg-primary text-white py-4 mt-8">
        <div className="container mx-auto text-center flex flex-col gap-2">
          <p className="text-sm">© 2025 FitMission. All rights reserved.</p>
          <div className="flex justify-center items-center gap-2">
            <a
              href="https://www.facebook.com/profile.php?id=61574863444917"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white underline flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-4 h-4"
              >
                <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.658-4.788 1.325 0 2.464.099 2.795.143v3.24h-1.918c-1.504 0-1.796.715-1.796 1.763v2.31h3.59l-.467 3.622h-3.123V24h6.116c.729 0 1.326-.597 1.326-1.326V1.326C24 .597 23.403 0 22.675 0z" />
              </svg>
              Follow us on Facebook
            </a>
          </div>
          <div className="flex justify-center mt-2 gap-2">
            <Popover>
              <PopoverTrigger className="text-sm text-white underline cursor-pointer mt-2">
                Privacy Policy
              </PopoverTrigger>
              <PopoverContent
                align="top"
                className="w-64 p-4 bg-white text-black rounded shadow-lg"
              >
                <h3 className="font-semibold">Privacy Policy</h3>
                <p className="mt-2 text-sm text-gray-700">
                  1. Information We Collect Personal data such as name, email,
                  and fitness preferences. Usage data, including device
                  information and activity logs. 2. How We Use Your Information
                  To provide and improve our services. To personalize user
                  experiences. To send important updates and promotional
                  materials (you can opt-out anytime). 3. Data Sharing and
                  Security We do not sell your personal information. Data is
                  securely stored and protected with encryption. We may share
                  anonymized data with third parties for analytics purposes. 4.
                  User Rights You can access, update, or delete your personal
                  data. You may request a copy of the information we store about
                  you. 5. Changes to This Policy FitMission may update this
                  Privacy Policy periodically. We will notify users of
                  significant changes.
                </p>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger className="text-sm text-white underline cursor-pointer mt-2">
                Terms and Conditions
              </PopoverTrigger>
              <PopoverContent
                align="top"
                className="w-64 p-4 bg-white text-black rounded shadow-lg"
              >
                <h3 className="font-semibold">Terms and Conditions</h3>
                <p className="mt-2 text-sm text-gray-700">
                  1. Introduction Welcome to FitMission! By accessing and using
                  our services, you agree to comply with the following terms and
                  conditions. Please read them carefully before using our
                  platform. 2. User Responsibilities You must be at least 18
                  years old or have parental consent to use FitMission. You are
                  responsible for maintaining the confidentiality of your
                  account credentials. You agree not to misuse the platform for
                  illegal activities or unauthorized modifications. 3. Health
                  Disclaimer FitMission provides general fitness and wellness
                  information but is not a substitute for professional medical
                  advice. Always consult a healthcare provider before starting
                  any fitness program. 4. Intellectual Property All content,
                  including text, images, and software, is the property of
                  FitMission and is protected by copyright laws. You may not
                  copy, distribute, or modify our content without permission. 5.
                  Limitation of Liability FitMission is not liable for any
                  injuries, damages, or losses resulting from the use of our
                  platform. We do not guarantee uninterrupted service and
                  reserve the right to modify or terminate services at any time.
                  6. Changes to Terms FitMission reserves the right to update
                  these terms at any time. Continued use of the platform
                  constitutes acceptance of the changes.
                </p>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
