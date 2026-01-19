import React from 'react';
import PageTransition from './PageTransition';
import SEO from './SEO';

const LegalPageLayout = ({
  title,
  description,
  breadcrumbs,
  badge = 'Juridisch',
  metaLine,
  children,
}) => {
  return (
    <PageTransition>
      <SEO title={title} description={description} breadcrumbs={breadcrumbs} />

      {/* Subtle decorative header (zonder titel, alleen achtergrond + golf) */}
      <section className="relative bg-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto px-6 pt-32 pb-16 relative z-10">
          {/* Leeg gelaten voor een rustige hero; titel staat in de contentkaart */}
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 100V60C240 20 480 0 720 20C960 40 1200 80 1440 60V100H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-10">
              {/* Titelblok in de kaart, goed leesbaar boven Artikel 1 */}
              <div className="mb-6 md:mb-8">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80 mb-3">
                  {badge}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                  {title}
                </h1>
                {metaLine && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {metaLine}
                  </p>
                )}
              </div>

              <div className="prose prose-stone max-w-none text-foreground">{children}</div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default LegalPageLayout;

