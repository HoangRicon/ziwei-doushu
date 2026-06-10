import type { BirthFormState } from '@/components/BirthForm';
import type { BirthInfo } from './types';

/**
 * Tiện ích chia sẻ bản đồ Tử Vi
 */

export function formToBirthInfo(form: BirthFormState): BirthInfo {
  return {
    year: parseInt(form.year) || 0,
    month: parseInt(form.month) || 0,
    day: parseInt(form.day) || 0,
    hour: form.unknownTime ? 0 : form.shichen,
    gender: form.gender,
    name: form.name || undefined,
  };
}

/** BirthFormState → URLSearchParams（用于分享链接） */
export function formToSearchParams(form: BirthFormState): URLSearchParams {
  const p = new URLSearchParams();
  if (form.name) p.set('n', form.name);
  p.set('y', form.year);
  p.set('m', form.month);
  p.set('d', form.day);
  p.set('h', String(form.shichen));
  p.set('g', form.gender === 'male' ? 'm' : 'f');
  if (form.unknownTime) p.set('u', '1');
  return p;
}

/** URLSearchParams → Partial<BirthFormState>，不完整时返回 null */
export function searchParamsToForm(params: URLSearchParams): Partial<BirthFormState> | null {
  const year = params.get('y');
  const month = params.get('m');
  const day = params.get('d');
  if (!year || !month || !day) return null;
  return {
    name: params.get('n') || '',
    year,
    month,
    day,
    shichen: parseInt(params.get('h') || '0'),
    unknownTime: params.get('u') === '1',
    gender: params.get('g') === 'f' ? 'female' : 'male',
  };
}
