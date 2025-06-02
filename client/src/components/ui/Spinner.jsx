import { motion } from 'framer-motion';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <motion.div
        className="w-12 h-12 border-4 border-primary-400 rounded-full"
        animate={{
          borderTopColor: ['#3B82F6', '#14B8A6', '#F97316', '#3B82F6'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      ></motion.div>
    </div>
  );
};

export default Spinner;