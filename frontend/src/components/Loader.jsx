import { motion, AnimatePresence } from 'framer-motion';

export default function Loader({ delayWarning }) {
  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-2xl shadow-lg text-black text-lg font-medium text-center space-y-2">
        <div>Loading...</div>
        <AnimatePresence>
          {delayWarning && (
            <motion.div
              key="delay-warning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-yellow-600 text-sm"
            >
              Server is taking a while to respond… it may be waking up.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
