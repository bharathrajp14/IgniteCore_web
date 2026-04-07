type CalendlyInlineProps = {
  url: string;
  title?: string;
};

export function CalendlyInline({ url, title = "Book a free AI audit" }: CalendlyInlineProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-2">
      <iframe
        src={url}
        title={title}
        className="h-[700px] w-full rounded-lg"
        loading="lazy"
      />
    </div>
  );
}
