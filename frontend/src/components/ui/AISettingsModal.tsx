import React from 'react';
import { AIStatusResponse } from '../../services/aiApi';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated?: (status: AIStatusResponse) => void;
}

export const AISettingsModal: React.FC<AISettingsModalProps> = () => {
  return null;
};
