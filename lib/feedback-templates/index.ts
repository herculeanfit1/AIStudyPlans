// Central export for all feedback email templates
export type { FeedbackEmailProps } from './template1';

import { getFeedbackEmailTemplate1 } from './template1';
import { getFeedbackEmailTemplate2 } from './template2';
import { getFeedbackEmailTemplate3 } from './template3';
import { getFeedbackEmailTemplate4 } from './template4';

export { getFeedbackEmailTemplate1, getFeedbackEmailTemplate2, getFeedbackEmailTemplate3, getFeedbackEmailTemplate4 };

/**
 * Get the appropriate feedback email template based on sequence position
 * @param sequencePosition - The position in the feedback sequence (1-4)
 * @param props - Email template properties
 * @returns Email template with HTML, text, and subject
 */
export function getFeedbackEmailTemplate(
  sequencePosition: number,
  props: import('./template1').FeedbackEmailProps
) {
  switch (sequencePosition) {
    case 1:
      return getFeedbackEmailTemplate1(props);
    case 2:
      return getFeedbackEmailTemplate2(props);
    case 3:
      return getFeedbackEmailTemplate3(props);
    case 4:
      return getFeedbackEmailTemplate4(props);
    default:
      throw new Error(`Invalid feedback email sequence position: ${sequencePosition}. Must be 1-4.`);
  }
} 