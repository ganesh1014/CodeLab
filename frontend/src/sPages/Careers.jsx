import { Briefcase, MapPin, Clock, DollarSign, ChevronRight, Sparkles } from 'lucide-react';

const openings = [
  {
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote (Global)',
    type: 'Full-time',
    salary: '$120k - $160k',
    description: 'Build the next generation of interactive coding environment with React, Tailwind, and WebAssembly.',
  },
  {
    title: 'Backend Engineer (Node.js + Redis)',
    department: 'Engineering',
    location: 'Remote (US/Europe)',
    type: 'Full-time',
    salary: '$130k - $170k',
    description: 'Scale our Judge0 integration and token blacklisting infrastructure. Experience with Redis required.',
  },
  {
    title: 'AI/ML Engineer',
    department: 'AI Team',
    location: 'Remote',
    type: 'Full-time',
    salary: '$140k - $180k',
    description: 'Improve our AI chatbot for problem-specific hints and code reviews using LLMs.',
  },
  {
    title: 'Content Creator (Video Solutions)',
    department: 'Content',
    location: 'Remote',
    type: 'Contract',
    salary: '$80k - $100k',
    description: 'Create high-quality video explanations for coding problems. Strong DSA knowledge needed.',
  },
  {
    title: 'Developer Advocate',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    salary: '$100k - $130k',
    description: 'Engage with the developer community, write tutorials, and represent CodeLab at events.',
  },
];

const benefits = [
  'Competitive salary + equity',
  '100% remote, flexible hours',
  'Home office stipend',
  'Unlimited PTO',
  'Learning budget ($2k/year)',
  'Health, dental, vision coverage',
];

const Careers = () => {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero */}
      <section className="py-20 border-b border-base-200 bg-base-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">Join Our Team</h1>
          <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
            Help us build the future of coding interview preparation. We're hiring remote talent worldwide.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-base-100/30 border-b border-base-200">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-base-content mb-8">Why join CodeLab?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2 text-base-content/80">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Openings */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-base-content mb-8">Open Positions</h2>
          <div className="space-y-4">
            {openings.map((job, idx) => (
              <div key={idx} className="bg-base-100 border border-base-200 rounded-xl p-6 shadow-sm hover:shadow transition-all">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-base-content">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-base-content/60">
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.department}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.type}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.salary}</span>
                    </div>
                    <p className="text-base-content/70 text-sm mt-3 max-w-2xl">{job.description}</p>
                  </div>
                  <button className="btn btn-outline border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl whitespace-nowrap">
                    Apply Now <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-base-100 border-t border-base-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-base-content mb-2">Don't see the perfect role?</h2>
          <p className="text-base-content/60 mb-6">We're always open to hearing from talented people.</p>
          <button className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-0 rounded-xl px-6">
            Send Spontaneous Application
          </button>
        </div>
      </section>
    </div>
  );
};

export default Careers;