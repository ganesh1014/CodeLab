import { Calendar, User, ArrowRight, BookOpen, Tag } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: '10 Common Coding Interview Mistakes and How to Avoid Them',
    excerpt: 'From edge cases to time complexity, learn the pitfalls that cost candidates their dream jobs.',
    date: 'Mar 15, 2025',
    author: 'Sarah Chen',
    category: 'Interview Tips',
    readTime: '5 min read',
    image: '🎯',
  },
  {
    id: 2,
    title: 'How to Use AI Chatbot for Problem Solving Without Cheating',
    excerpt: 'Leverage AI to understand patterns, not to copy solutions. Best practices inside.',
    date: 'Mar 10, 2025',
    author: 'Alex Rivera',
    category: 'AI & Learning',
    readTime: '4 min read',
    image: '🤖',
  },
  {
    id: 3,
    title: 'Master Dynamic Programming: A Step-by-Step Framework',
    excerpt: 'The 5-step approach that makes DP problems manageable – with examples from CodeLab.',
    date: 'Mar 5, 2025',
    author: 'Emily Zhang',
    category: 'Algorithms',
    readTime: '8 min read',
    image: '📐',
  },
  {
    id: 4,
    title: 'Behind the Scenes: Building Judge0 Integration at Scale',
    excerpt: 'How we handle 50,000+ code executions daily with sandboxed security.',
    date: 'Feb 28, 2025',
    author: 'Mike Johnson',
    category: 'Engineering',
    readTime: '6 min read',
    image: '⚙️',
  },
  {
    id: 5,
    title: 'From Zero to Interview Ready: A 3-Month Study Plan',
    excerpt: 'A structured roadmap using CodeLab’s problem sets and video solutions.',
    date: 'Feb 20, 2025',
    author: 'Priya Patel',
    category: 'Learning Paths',
    readTime: '7 min read',
    image: '📅',
  },
  {
    id: 6,
    title: 'Why Video Solutions Improve Retention vs. Reading Only',
    excerpt: 'Cognitive science research applied to coding interview prep.',
    date: 'Feb 14, 2025',
    author: 'Dr. James Lee',
    category: 'Education',
    readTime: '5 min read',
    image: '🎬',
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero */}
      <section className="py-20 border-b border-base-200 bg-base-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">CodeLab Blog</h1>
          <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
            Insights, tutorials, and updates from the CodeLab team.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-base-100 border border-base-200 rounded-xl overflow-hidden shadow-sm hover:shadow transition-all flex flex-col">
                <div className="h-40 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center text-5xl">
                  {post.image}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-xs text-base-content/50 mb-3">
                    <Tag className="w-3 h-3" />
                    <span>{post.category}</span>
                    <span className="mx-1">•</span>
                    <Calendar className="w-3 h-3" />
                    <span>{post.date}</span>
                  </div>
                  <h2 className="text-xl font-bold text-base-content mb-2 line-clamp-2">{post.title}</h2>
                  <p className="text-base-content/60 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-base-200">
                    <div className="flex items-center gap-2 text-xs text-base-content/50">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
                      Read more <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination (dummy) */}
          <div className="flex justify-center mt-12">
            <div className="join">
              <button className="join-item btn btn-sm btn-ghost rounded-l-xl">«</button>
              <button className="join-item btn btn-sm btn-active bg-indigo-600 text-white">1</button>
              <button className="join-item btn btn-sm btn-ghost">2</button>
              <button className="join-item btn btn-sm btn-ghost">3</button>
              <button className="join-item btn btn-sm btn-ghost rounded-r-xl">»</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;