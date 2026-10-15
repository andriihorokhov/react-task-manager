import { Suspense } from 'react';
import App from '../../App';

export default function TasksPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  );
}
