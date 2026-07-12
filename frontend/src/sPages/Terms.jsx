import { FileText, Scale, AlertCircle, CheckCircle, Clock, Users } from 'lucide-react';

const sections = [
  {
    icon: Scale,
    title: 'Acceptance of Terms',
    content: `By accessing or using CodeLab, you agree to be bound by these Terms of Service. If you disagree with any part, you may not access the platform.`,
  },
  {
    icon: Users,
    title: 'User Accounts',
    content: `You are responsible for maintaining the confidentiality of your account credentials. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use.`,
  },
  {
    icon: AlertCircle,
    title: 'Code of Conduct',
    content: `You agree to use CodeLab only for lawful purposes. You shall not: (a) cheat or submit plagiarized solutions, (b) attempt to reverse engineer our platform or Judge0 integration, (c) harass other users, or (d) use automated scripts to solve problems.`,
  },
  {
    icon: CheckCircle,
    title: 'Paid Services & Subscriptions',
    content: `Some features may require payment. All fees are non-refundable unless required by law. We reserve the right to change pricing with 30 days' notice.`,
  },
  {
    icon: Clock,
    title: 'Termination',
    content: `We may terminate or suspend your account immediately for violations of these Terms. Upon termination, your right to use the platform will cease. You can also delete your account at any time from settings.`,
  },
  {
    icon: FileText,
    title: 'Intellectual Property',
    content: `CodeLab owns all platform code, design, and content except user submissions. You retain ownership of your code solutions, but grant us a license to display and analyze them for platform improvement.`,
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero */}
      <section className="py-16 border-b border-base-200 bg-base-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-base-content mb-3">Terms of Service</h1>
          <p className="text-base-content/60">Effective: March 1, 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-base-100 border border-base-200 rounded-xl p-6 md:p-8 shadow-sm space-y-8">
            <p className="text-base-content/70">
              Welcome to CodeLab! These Terms of Service govern your use of our website, API, and services. By using CodeLab, you agree to these terms.
            </p>

            {sections.map((section, idx) => (
              <div key={idx} className="border-t border-base-200 pt-6 first:border-0 first:pt-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center">
                    <section.icon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-base-content">{section.title}</h2>
                </div>
                <p className="text-base-content/70 text-sm leading-relaxed">{section.content}</p>
              </div>
            ))}

            <div className="border-t border-base-200 pt-6">
              <h2 className="text-xl font-semibold text-base-content mb-2">Disclaimer of Warranties</h2>
              <p className="text-base-content/70 text-sm">
                CodeLab is provided "as is" without warranties of any kind. We do not guarantee that the platform will be uninterrupted or error-free. We are not responsible for any damages arising from your use of the platform.
              </p>
            </div>

            <div className="border-t border-base-200 pt-6">
              <h2 className="text-xl font-semibold text-base-content mb-2">Governing Law</h2>
              <p className="text-base-content/70 text-sm">
                These Terms shall be governed by the laws of the State of California, without regard to its conflict of law provisions.
              </p>
            </div>

            <div className="border-t border-base-200 pt-6">
              <h2 className="text-xl font-semibold text-base-content mb-2">Contact</h2>
              <p className="text-base-content/70 text-sm">
                For any questions about these Terms, please contact us at <strong>mahadik1014@gmail.com</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;