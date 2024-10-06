import { FaCheckCircle, FaClipboardList, FaEnvelope } from 'react-icons/fa';

const checklistItems = [
  {
    title: 'Job Search Checklist',
    description: "Are you a tech professional navigating the competitive job market? Our Job Search Checklist is designed for young tech talents like you, simplifying the job search process into actionable steps to help you stand out and be prepared.",
    link: '/checklist',
    icon: <FaClipboardList className="text-blue-900" />,
  },
  {
    title: 'Resume/Portfolio Review',
    description: 'Are you unsure if your resume or portfolio showcases your best self? Our Resume/Portfolio Review feature offers expert feedback to help you identify strengths and areas for improvement.',
    link: '/submission',
    icon: <FaCheckCircle className="text-blue-900" />,
  },
  {
    title: 'Contact Form',
    description: 'Feeling lost in your job search? Our contact form makes it easy to schedule a live session for personalized career guidance.',
    link: '/contact-form',
    icon: <FaEnvelope className="text-blue-900" />,
  },
];

// Dummy data for stats
const stats = {
  checklistsDone: 0,
  reviewsDone: 0,
  liveSessionsScheduled: 0,
};

const DashBoardList = () => {
  return (
    <div className="min-h-screen shadow-xl flex flex-col items-center justify-center py-10">

      {/* Welcome Message */}
      <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-blue-700 text-center">Welcome to Your Grad Gear!</h1>
      <h4 className="text-gray-600 text-center mb-8 px-4">
        Ready to take the next step in your career? Our dashboard is your go-to resource for job readiness. Use our Job Search Checklist to ensure you have all the essentials covered...
      </h4>

      {/* Stats Boxes */}
      <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-10 w-full max-w-5xl">
        <div className="bg-white dark:bg-gray-700 text-center p-6 rounded-xl shadow-lg">
          <h2 className="text-4xl font-bold text-blue-900 dark:text-black">{stats.checklistsDone}</h2>
          <p className="text-lg text-gray-700 dark:text-blue-600 mt-2">Checklists Completed</p>
        </div>
        <div className="bg-white text-center dark:bg-gray-700 p-6 rounded-xl shadow-lg">
          <h2 className="text-4xl font-bold text-blue-900 dark:text-black">{stats.reviewsDone}</h2>
          <p className="text-lg text-gray-700  dark:text-blue-600 mt-2">Reviews Completed</p>
        </div>
        <div className="bg-white text-center p-6 dark:bg-gray-700 rounded-xl shadow-lg">
          <h2 className="text-4xl font-bold text-blue-900 dark:text-black">{stats.liveSessionsScheduled}</h2>
          <p className="text-lg text-gray-700  dark:text-blue-600 mt-2">Live Sessions Scheduled</p>
        </div>
      </div>

      {/* Checklist Items */}
      <ul className="block lg:flex mt-10 space-y-6 lg:space-y-0 lg:space-x-6 w-full max-w-5xl">
        {checklistItems.map((item, index) => (
          <li
            key={index}
            className="grid-cols-3 gap-6 mb-10 w-full max-w-4xl bg-white dark:bg-gray-700 shadow-lg rounded-lg p-6 hover:bg-gray-50 hover:scale-105 transition duration-300 ease-in-out"
          >
            <h3 className="flex items-center dark:text-blue-600 space-x-3 text-xl font-bold text-gray-700">
              {item.icon}
              <span>{item.title}</span>
            </h3>
            <p className="text-gray-600 dark:text-black mt-3">{item.description}</p>
            <a
              href={item.link}
              rel="noopener noreferrer"
              className="mt-4 inline-block bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Start Your Journey
            </a>
          </li>
        ))}
      </ul>

      {/* Success Stories */}
      <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg text-center w-full max-w-5xl">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-blue-600 ">Success Stories</h2>
        <p className="text-gray-600 dark:text-black italic mt-2">"Thanks to the Resume Review feature, I landed my dream job!" - Jane Doe</p>
      </div>
    </div>
  );
};

export default DashBoardList;