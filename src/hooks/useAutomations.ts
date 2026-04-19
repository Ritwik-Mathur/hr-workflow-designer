import { useState, useEffect } from 'react';
import { getAutomations } from '../api/mockApi';
import type { AutomationAction } from '../types/workflow';

export function useAutomations() {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);

  useEffect(() => {
    getAutomations().then(setAutomations);
  }, []);

  return { automations };
}
