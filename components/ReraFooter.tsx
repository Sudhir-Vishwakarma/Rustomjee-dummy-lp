export default function ReraFooter() {
  return (
    <section className="bg-navy-light px-4 py-8 text-sm text-sand/90">
      <div className="mx-auto max-w-6xl">
        <p>RERA Registration — Wing A: P00000000000 | Wing B: P00000000001</p>
        <p className="mt-2">
          This is a sample project built for demonstration purposes only and is not an official
          or live real estate listing. For details on any real project, refer to the developer&apos;s
          official website and the{' '}
          <a
            href="https://maharera.mahaonline.gov.in"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            Maharashtra RERA portal
          </a>
          .
        </p>
      </div>
    </section>
  );
}
