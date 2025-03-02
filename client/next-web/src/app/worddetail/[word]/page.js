"use client";

import Header from "../../_components/Header";
import Footer from "../../_components/Footer";
import WordDetailContent from "../_components/WordDetailContent";

export default function WordDetailPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
    
      <Header />

     
      <main className="flex-grow">
        <WordDetailContent />
      </main>

     
      <Footer />
    </div>
  );
}
