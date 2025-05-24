import React from 'react';

interface LinkGroup {
  title: string;
  links: { text: string; href: string }[];
}

/**
 * Footer section component for the landing page
 * Contains links, company info, and legal information
 */
export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  const linkGroups: LinkGroup[] = [
    {
      title: "Features",
      links: [
        { text: "Personalized Study Plans", href: "#" },
        { text: "Resource Recommendations", href: "#" },
        { text: "Progress Tracking", href: "#" },
        { text: "Learning Style Adaptation", href: "#" }
      ]
    },
    {
      title: "Company", 
      links: [
        { text: "About Us", href: "#" },
        { text: "Careers", href: "#" },
        { text: "Blog", href: "#" },
        { text: "Contact", href: "#" }
      ]
    },
    {
      title: "Legal",
      links: [
        { text: "Terms of Service", href: "#" },
        { text: "Privacy Policy", href: "#" },
        { text: "Youth Privacy Policy", href: "#" },
        { text: "Cookie Policy", href: "#" }
      ]
    }
  ];

  const socialLinks = [
    { icon: "fab fa-twitter", href: "#" },
    { icon: "fab fa-instagram", href: "#" },
    { icon: "fab fa-linkedin", href: "#" }
  ];

  return (
    <footer className="bg-gray-800 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">SchedulEd</h3>
            <p className="mb-4">
              AI-powered study plan generator creating personalized learning
              paths tailored to individual learning styles.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition"
                >
                  <i className={social.icon} aria-hidden="true"></i>
                </a>
              ))}
            </div>
          </div>

          {/* Link Groups */}
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-lg font-medium text-white mb-4">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.text}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} SchedulEd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 