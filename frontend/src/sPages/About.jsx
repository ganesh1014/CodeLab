import { Code, Users, Zap, Shield, Award, BookOpen, TrendingUp, Heart } from 'lucide-react';

const About = () => {
  const stats = [
    { value: '2,500+', label: 'Problems Solved', icon: BookOpen },
    { value: '100K+', label: 'Active Users', icon: Users },
    { value: '72%', label: 'Success Rate', icon: TrendingUp },
    { value: '50+', label: 'Team Members', icon: Users },
  ];

  const values = [
    { icon: Heart, title: 'Community First', desc: 'We believe in collaborative learning and knowledge sharing.' },
    { icon: Zap, title: 'Fast Innovation', desc: 'Shipping features weekly to improve your experience.' },
    { icon: Shield, title: 'Privacy & Security', desc: 'Your data is protected with enterprise-grade measures.' },
    { icon: Award, title: 'Excellence', desc: 'We only accept the highest quality problems and solutions.' },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero */}
      <section className="py-20 md:py-28 border-b border-base-200 bg-base-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">About CodeLab</h1>
          <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
            We're on a mission to help developers master coding interviews through curated problems, video solutions, and AI-powered assistance.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-base-content mb-4">Our Story</h2>
              <p className="text-base-content/70 mb-4">
                Founded in 2022, CodeLab started as a small project by two software engineers who were frustrated with the lack of high-quality, structured interview preparation resources.
              </p>
              <p className="text-base-content/70">
                Today, we've grown into a platform trusted by over 100,000 developers worldwide. We combine expert video solutions, an AI chatbot, and real-time code execution (powered by Judge0) to provide the most comprehensive learning experience.
              </p>
            </div>
            <div className="bg-base-100 border border-base-200 rounded-xl p-6 shadow-sm">
              <div className="aspect-video bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-16 h-16 text-indigo-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-base-100 border-y border-base-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/30 items-center justify-center mb-3">
                  <stat.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="text-2xl font-bold text-base-content">{stat.value}</div>
                <div className="text-sm text-base-content/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-base-content mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => (
              <div key={idx} className="bg-base-100 border border-base-200 rounded-xl p-6 text-center shadow-sm hover:shadow transition-shadow">
                <div className="inline-flex w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/30 items-center justify-center mb-4">
                  <val.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-base-content mb-2">{val.title}</h3>
                <p className="text-sm text-base-content/60">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-16 bg-base-100 border-y border-base-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-base-content mb-2">Join Our Team</h2>
          <p className="text-base-content/60 mb-6">We're always looking for passionate engineers, educators, and creatives.</p>
          <a href="/careers" className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-0 rounded-xl px-6">
            View Openings
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;