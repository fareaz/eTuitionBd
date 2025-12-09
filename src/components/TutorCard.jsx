
import { motion } from 'framer-motion';
const Avatar = ({ name }) => {
  const initials = (name || '??')
    .split(' ')
    .map(n => n?.[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold">
      {initials}
    </div>
  );
};
const TutorCard = ({ tutor, index }) => {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="p-4 bg-white rounded-xl shadow-md min-h-[220px] flex flex-col"
    >
      <div className="flex items-center gap-3">
        <Avatar name={tutor.name} />
        <div>
          <div className="text-sm text-gray-500">{tutor.role || 'Tutor'}</div>
          <div className="text-lg font-semibold">{tutor.name || tutor.displayName || 'No name'}</div>
          <a className="text-xs text-sky-600 hover:underline" href={`mailto:${tutor.email}`}>{tutor.email || '—'}</a>
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-700 grow">
        <p className="mb-1"><strong>Qualifications:</strong> {tutor.qualifications || 'Not provided'}</p>
        <p className="mb-1"><strong>Experience:</strong> {tutor.experience || 'Not provided'}</p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">Expected Salary</div>
        <div className="font-semibold text-green-600">৳{tutor.expectedSalary ?? '—'}</div>
      </div>
    </motion.article>
  );
};

export default TutorCard;