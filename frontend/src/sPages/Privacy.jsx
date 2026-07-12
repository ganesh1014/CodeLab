import { Shield, Eye, Database, Lock, Server, UserCheck } from 'lucide-react';

const sections = [
  {
    icon: Shield,
    title: 'Information We Collect',
    content: `We collect information you provide directly to us, such as when you create an account, submit solutions, or contact support. This may include your name, email address, profile picture, and coding submissions. We also collect usage data automatically (e.g., problems solved, time spent) to improve our platform.`,
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: `We use your information to provide, maintain, and improve CodeLab services, to personalize your learning experience, to communicate with you about updates, and to ensure platform security. We do not sell your personal data to third parties.`,
  },
  {
    icon: Database,
    title: 'Data Storage & Security',
    content: `Your data is stored on encrypted servers with regular backups. We use Redis for session management and token blacklisting, ensuring your authentication tokens are invalidated upon logout to prevent unauthorized access.`,
  },
  {
    icon: Lock,
    title: 'Your Rights',
    content: `You have the right to access, correct, or delete your personal data. You can also request a copy of your data in a portable format. To exercise these rights, contact privacy@codelab.com.`,
  },
  {
    icon: Server,
    title: 'Third-Party Services',
    content: `We integrate with Judge0 API for code execution. Your code submissions are sent to Judge0's sandboxed environment temporarily. We do not share your personal information with Judge0.`,
  },
  {
    icon: UserCheck,
    title: 'Childrens Privacy',
    content: `CodeLab is not intended for children under 13. We do not knowingly collect personal information from children under 13.`,
  },
];

const Privacy = () => {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero */}
      <section className="py-16 border-b border-base-200 bg-base-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-base-content mb-3">Privacy Policy</h1>
          <p className="text-base-content/60">Last updated: March 1, 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-base-100 border border-base-200 rounded-xl p-6 md:p-8 shadow-sm space-y-8">
            <p className="text-base-content/70">
              At CodeLab, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information when you use our platform.
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
              <h2 className="text-xl font-semibold text-base-content mb-2">Contact Us</h2>
              <p className="text-base-content/70 text-sm">
                If you have any questions about this Privacy Policy, please contact us at: <br />
                <strong>mahadik1014@gmail.com</strong> or write to: CodeLab Privacy, Pune 412207.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;