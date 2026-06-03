// ============================================================
// Validation Helpers — AutomateRiz
// ============================================================

export interface ValidationError {
  field: string;
  message: string;
}

export function validateName(name: string): string | null {
  if (!name || name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }
  return null;
}

export function validateWhatsApp(wa: string): string | null {
  if (!wa) return 'WhatsApp number is required';
  const cleaned = wa.replace(/[\s\-\(\)]/g, '');
  const pattern = /^(\+62|62|08)\d{8,13}$/;
  if (!pattern.test(cleaned)) {
    return 'Enter a valid Indonesian phone number (08xx or +62xx)';
  }
  return null;
}

export function validateEmail(email: string): string | null {
  if (!email) return 'Email is required';
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(email)) {
    return 'Enter a valid email address';
  }
  return null;
}

export function validateServiceType(type: string): string | null {
  if (!['training', 'automation', 'both'].includes(type)) {
    return 'Please select a service type';
  }
  return null;
}

export function validateProjectDetail(detail: string): string | null {
  if (!detail || detail.trim().length < 20) {
    return 'Project details must be at least 20 characters';
  }
  if (detail.length > 1000) {
    return 'Project details must be under 1000 characters';
  }
  return null;
}

export function validateLeadForm(data: {
  name: string;
  whatsapp: string;
  email: string;
  serviceType: string;
  projectDetail: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  const nameErr = validateName(data.name);
  if (nameErr) errors.push({ field: 'name', message: nameErr });

  const waErr = validateWhatsApp(data.whatsapp);
  if (waErr) errors.push({ field: 'whatsapp', message: waErr });

  const emailErr = validateEmail(data.email);
  if (emailErr) errors.push({ field: 'email', message: emailErr });

  const serviceErr = validateServiceType(data.serviceType);
  if (serviceErr) errors.push({ field: 'serviceType', message: serviceErr });

  const detailErr = validateProjectDetail(data.projectDetail);
  if (detailErr) errors.push({ field: 'projectDetail', message: detailErr });

  return errors;
}
