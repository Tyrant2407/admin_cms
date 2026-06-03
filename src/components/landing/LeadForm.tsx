'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { submitLead } from '@/lib/api';
import {
  validateName,
  validateWhatsApp,
  validateEmail,
  validateServiceType,
  validateProjectDetail,
} from '@/lib/validation';
import type { ServiceType } from '@/lib/types';
import styles from './LeadForm.module.css';

interface FormErrors {
  [key: string]: string | null;
}

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    serviceType: '' as string,
    projectDetail: '',
    honeypot: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateField = useCallback((name: string, value: string) => {
    let error: string | null = null;
    switch (name) {
      case 'name': error = validateName(value); break;
      case 'whatsapp': error = validateWhatsApp(value); break;
      case 'email': error = validateEmail(value); break;
      case 'serviceType': error = validateServiceType(value); break;
      case 'projectDetail': error = validateProjectDetail(value); break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Honeypot check
    if (formData.honeypot) return;

    // Validate all fields
    const fieldErrors: FormErrors = {};
    fieldErrors.name = validateName(formData.name);
    fieldErrors.whatsapp = validateWhatsApp(formData.whatsapp);
    fieldErrors.email = validateEmail(formData.email);
    fieldErrors.serviceType = validateServiceType(formData.serviceType);
    fieldErrors.projectDetail = validateProjectDetail(formData.projectDetail);

    setErrors(fieldErrors);

    const hasErrors = Object.values(fieldErrors).some(e => e !== null);
    if (hasErrors) return;

    setIsSubmitting(true);

    try {
      await submitLead({
        name: formData.name,
        whatsapp: formData.whatsapp,
        email: formData.email,
        serviceType: formData.serviceType as ServiceType,
        projectDetail: formData.projectDetail,
      });

      setIsSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section className={styles.contact} id="contact">
        <div className={styles.inner}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✓</div>
            <h3 className={styles.successTitle}>Thank You!</h3>
            <p className={styles.successText}>
              We&apos;ve received your inquiry and will get back to you within 24 hours.
              <br />Check your WhatsApp and email for our response.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.contact} id="contact">
      <div className={styles.inner}>
        <motion.h2
          className={`heading-lg ${styles.heading}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          Ready to Start? Contact Us
        </motion.h2>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Fill out the form below and we&apos;ll reach out within 24 hours
        </motion.p>

        <motion.div
          className={styles.formCard}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {submitError && (
            <div className={styles.errorToast}>
              ⚠️ {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {/* Honeypot */}
            <div className={styles.honeypot}>
              <label htmlFor="honeypot-field" className="sr-only">Leave this empty</label>
              <input
                type="text"
                name="honeypot"
                id="honeypot-field"
                value={formData.honeypot}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Name */}
            <div className="form-group">
              <input
                type="text"
                name="name"
                id="form-name"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder=" "
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="name"
              />
              <label htmlFor="form-name" className="form-label">Full Name</label>
              {errors.name && <div className="form-error">⚠ {errors.name}</div>}
            </div>

            {/* WhatsApp */}
            <div className="form-group">
              <input
                type="tel"
                name="whatsapp"
                id="form-whatsapp"
                className={`form-input ${errors.whatsapp ? 'error' : ''}`}
                placeholder=" "
                value={formData.whatsapp}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="tel"
              />
              <label htmlFor="form-whatsapp" className="form-label">WhatsApp Number</label>
              {errors.whatsapp && <div className="form-error">⚠ {errors.whatsapp}</div>}
            </div>

            {/* Email */}
            <div className="form-group">
              <input
                type="email"
                name="email"
                id="form-email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder=" "
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="email"
              />
              <label htmlFor="form-email" className="form-label">Email Address</label>
              {errors.email && <div className="form-error">⚠ {errors.email}</div>}
            </div>

            {/* Service Type */}
            <div className="form-group">
              <label htmlFor="form-service" className="sr-only">Service Type</label>
              <select
                name="serviceType"
                id="form-service"
                className={`form-select ${errors.serviceType ? 'error' : ''}`}
                value={formData.serviceType}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="" disabled>Select Service Type</option>
                <option value="training">Training & Workshop</option>
                <option value="automation">Custom Automation</option>
                <option value="both">Both Services</option>
              </select>
              {errors.serviceType && <div className="form-error">⚠ {errors.serviceType}</div>}
            </div>

            {/* Project Detail */}
            <div className="form-group">
              <textarea
                name="projectDetail"
                id="form-detail"
                className={`form-input ${errors.projectDetail ? 'error' : ''}`}
                placeholder=" "
                value={formData.projectDetail}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={4}
                style={{ resize: 'vertical' }}
              />
              <label htmlFor="form-detail" className="form-label">Project Details / Goals</label>
              {errors.projectDetail && <div className="form-error">⚠ {errors.projectDetail}</div>}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '4px' }}>
                {formData.projectDetail.length}/1000
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" />
                  Submitting...
                </>
              ) : (
                'Send Inquiry'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
