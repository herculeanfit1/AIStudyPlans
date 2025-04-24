'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 mt-auto border-t border-gray-200 bg-white">
      <div className="container text-center">
        <p className="text-gray-500">
          &copy; {currentYear} SchedulEd. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 