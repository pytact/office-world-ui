// Employee Create Form UI Component
// SCR_EMPLOYEE_CREATE - Pure UI component following R7 and R10
// Composes UI primitives following R16

"use client";

import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { Controller, UseFormReturn } from "react-hook-form";
import { Button, Input, Select, Textarea, Card } from "@/components/ui";
import { employeeRoutes } from "@/utils/routes/employee.routes";
import { EmployeeCreateFormSchema } from "@/modules/employees/forms/employee.schema";
import { spacing, typography, colors } from "@/theme/tokens";
import { borderRadius } from "@/theme/tokens/borders";

interface EmployeeCreateFormProps {
  form: UseFormReturn<EmployeeCreateFormSchema>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading: boolean;
  userOptions: Array<{ value: string; label: string }>;
}

// ENUM options
const employmentStatusOptions = [
  { value: "TRAINEE", label: "Trainee" },
  { value: "PROBATION", label: "On Probation" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "NOTICE_PERIOD", label: "Notice Period" },
  { value: "ACTIVE", label: "Active" },
  { value: "ON_HOLD", label: "On Hold" },
  { value: "TERMINATED", label: "Terminated" },
  { value: "RESIGNED", label: "Resigned" },
];

const departmentOptions = [
  { value: "", label: "Select Department" },
  { value: "FRONTEND", label: "Frontend" },
  { value: "BACKEND", label: "Backend" },
  { value: "FULLSTACK", label: "Full Stack" },
  { value: "QA", label: "Quality Assurance" },
  { value: "HR", label: "Human Resources" },
  { value: "DEVOPS", label: "DevOps" },
  { value: "UIUX", label: "UI/UX" },
  { value: "PRODUCT", label: "Product" },
  { value: "MARKETING", label: "Marketing" },
  { value: "DATA", label: "Data" },
  { value: "SUPPORT", label: "Support" },
];

const employmentTypeOptions = [
  { value: "", label: "Select Employment Type" },
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "FREELANCE", label: "Freelance" },
  { value: "TEMPORARY", label: "Temporary" },
];

const employmentLevelOptions = [
  { value: "", label: "Select Employment Level" },
  { value: "INTERN", label: "Intern" },
  { value: "JUNIOR", label: "Junior" },
  { value: "MID", label: "Mid" },
  { value: "SENIOR", label: "Senior" },
  { value: "LEAD", label: "Lead" },
  { value: "MANAGER", label: "Manager" },
];

const genderOptions = [
  { value: "", label: "Select Gender" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

const maritalStatusOptions = [
  { value: "", label: "Select Marital Status" },
  { value: "SINGLE", label: "Single" },
  { value: "MARRIED", label: "Married" },
  { value: "DIVORCED", label: "Divorced" },
  { value: "WIDOWED", label: "Widowed" },
  { value: "SEPARATED", label: "Separated" },
];

const bloodGroupOptions = [
  { value: "", label: "Select Blood Group" },
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

const documentTypeOptions = [
  { value: "", label: "Select Document Type" },
  { value: "AADHAAR", label: "Aadhaar" },
  { value: "PAN", label: "PAN" },
  { value: "DL", label: "Driving License" },
  { value: "VOTER_ID", label: "Voter ID" },
  { value: "PASSPORT", label: "Passport" },
];

export const EmployeeCreateForm = React.memo(function EmployeeCreateForm({
  form,
  onSubmit,
  onCancel,
  isLoading,
  userOptions,
}: EmployeeCreateFormProps) {
  const {
    register,
    control,
    formState: { errors },
    watch,
  } = form;

  const employmentStatus = watch("employment_status");
  const showSeparationFields = useMemo(
    () => employmentStatus === "RESIGNED" || employmentStatus === "TERMINATED",
    [employmentStatus]
  );

  // Memoize user options with default option
  const userSelectOptions = useMemo(
    () => [{ value: "", label: "Select User" }, ...userOptions],
    [userOptions]
  );

  // Memoized style objects - Modern, clean, spacious design
  const containerStyle = useMemo(
    () => ({
      padding: `${spacing[8]} ${spacing[6]}`,
      maxWidth: "900px",
      margin: "0 auto",
      backgroundColor: colors.backgroundSecondary,
      minHeight: "100vh",
    } as const),
    []
  );

  const backLinkStyle = useMemo(
    () => ({
      color: colors.primary,
      textDecoration: "none",
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize.body,
      marginBottom: spacing[6],
      display: "inline-block",
      fontWeight: typography.fontWeight.medium,
    } as const),
    []
  );

  const headingStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h1,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.bold,
      color: colors.textPrimary,
      lineHeight: typography.lineHeight.h1,
      marginBottom: spacing[10],
      letterSpacing: "-0.02em",
    } as const),
    []
  );

  const sectionTitleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h4,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: spacing[6],
      marginTop: spacing[10],
      letterSpacing: "-0.01em",
    } as const),
    []
  );

  const sectionContainerStyle = useMemo(
    () => ({
      marginBottom: spacing[10],
    } as const),
    []
  );

  const fieldGroupStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[3],
      marginBottom: spacing[6],
    } as const),
    []
  );

  const labelStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.medium,
      color: colors.textPrimary,
      marginBottom: spacing[1],
    } as const),
    []
  );

  const requiredLabelStyle = useMemo(
    () => ({
      color: colors.errorText,
    } as const),
    []
  );

  const buttonContainerStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[4],
      marginTop: spacing[12],
      paddingTop: spacing[8],
      justifyContent: "flex-end",
    } as const),
    []
  );

  // Get today's date in YYYY-MM-DD format for max date validation
  const today = useMemo(() => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  }, []);

  // Memoized error message style
  const errorMessageStyle = useMemo(
    () => ({
      padding: `${spacing[4]} ${spacing[5]}`,
      backgroundColor: colors.errorBg,
      color: colors.errorText,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      marginBottom: spacing[8],
      lineHeight: typography.lineHeight.body,
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      <Link href={employeeRoutes.company.list} style={backLinkStyle}>
        ← Back to Employees
      </Link>

      <h1 style={headingStyle}>Create Employee</h1>

      <Card variant="elevated" padding="lg">
        <form onSubmit={onSubmit}>
          {/* Root Error Message */}
          {errors.root && (
            <div style={errorMessageStyle}>
              {errors.root.message}
            </div>
          )}

          {/* User Selection Section */}
          <div style={sectionContainerStyle}>
            <h2 style={sectionTitleStyle}>User Selection</h2>
            <div style={fieldGroupStyle}>
            <label style={labelStyle}>
              User <span style={requiredLabelStyle}>*</span>
            </label>
            <Controller
              name="user_id"
              control={control}
              render={({ field }) => (
                <Select
                  options={userSelectOptions}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={!!errors.user_id}
                  errorMessage={errors.user_id?.message}
                />
              )}
            />
            </div>
          </div>

          {/* Required Fields Section */}
          <div style={sectionContainerStyle}>
            <h2 style={sectionTitleStyle}>Required Information</h2>
            <div style={fieldGroupStyle}>
            <label style={labelStyle}>
              Joining Date <span style={requiredLabelStyle}>*</span>
            </label>
            <Input
              type="date"
              max={today}
              {...register("joining_date")}
              error={!!errors.joining_date}
              errorMessage={errors.joining_date?.message}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>
              Employment Status <span style={requiredLabelStyle}>*</span>
            </label>
            <Controller
              name="employment_status"
              control={control}
              render={({ field }) => (
                <Select
                  options={employmentStatusOptions}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={!!errors.employment_status}
                  errorMessage={errors.employment_status?.message}
                />
              )}
            />
            </div>
          </div>

          {/* Professional Information Section */}
          <div style={sectionContainerStyle}>
            <h2 style={sectionTitleStyle}>Professional Information</h2>
            <div style={fieldGroupStyle}>
            <label style={labelStyle}>Job Title</label>
            <Input
              type="text"
              placeholder="Enter job title (optional)"
              {...register("job_title")}
              error={!!errors.job_title}
              errorMessage={errors.job_title?.message}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Department</label>
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <Select
                  options={departmentOptions}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  error={!!errors.department}
                  errorMessage={errors.department?.message}
                />
              )}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Employment Type</label>
            <Controller
              name="employment_type"
              control={control}
              render={({ field }) => (
                <Select
                  options={employmentTypeOptions}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  error={!!errors.employment_type}
                  errorMessage={errors.employment_type?.message}
                />
              )}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Employment Level</label>
            <Controller
              name="employment_level"
              control={control}
              render={({ field }) => (
                <Select
                  options={employmentLevelOptions}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  error={!!errors.employment_level}
                  errorMessage={errors.employment_level?.message}
                />
              )}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Work Email</label>
            <Input
              type="email"
              placeholder="Enter work email (optional)"
              {...register("work_email")}
              error={!!errors.work_email}
              errorMessage={errors.work_email?.message}
            />
            </div>
          </div>

          {/* Personal Information Section */}
          <div style={sectionContainerStyle}>
            <h2 style={sectionTitleStyle}>Personal Information</h2>
            <div style={fieldGroupStyle}>
            <label style={labelStyle}>Gender</label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  options={genderOptions}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  error={!!errors.gender}
                  errorMessage={errors.gender?.message}
                />
              )}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Marital Status</label>
            <Controller
              name="marital_status"
              control={control}
              render={({ field }) => (
                <Select
                  options={maritalStatusOptions}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  error={!!errors.marital_status}
                  errorMessage={errors.marital_status?.message}
                />
              )}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Blood Group</label>
            <Controller
              name="blood_group"
              control={control}
              render={({ field }) => (
                <Select
                  options={bloodGroupOptions}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  error={!!errors.blood_group}
                  errorMessage={errors.blood_group?.message}
                />
              )}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Nationality</label>
            <Input
              type="text"
              placeholder="Enter nationality (optional)"
              {...register("nationality")}
              error={!!errors.nationality}
              errorMessage={errors.nationality?.message}
            />
            </div>
          </div>

          {/* Location Information Section */}
          <div style={sectionContainerStyle}>
            <h2 style={sectionTitleStyle}>Location Information</h2>
            <div style={fieldGroupStyle}>
            <label style={labelStyle}>Address</label>
            <Textarea
              placeholder="Enter address (optional)"
              rows={3}
              {...register("address")}
              error={!!errors.address}
              errorMessage={errors.address?.message}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>City</label>
            <Input
              type="text"
              placeholder="Enter city (optional)"
              {...register("city")}
              error={!!errors.city}
              errorMessage={errors.city?.message}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>State</label>
            <Input
              type="text"
              placeholder="Enter state (optional)"
              {...register("state")}
              error={!!errors.state}
              errorMessage={errors.state?.message}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Country</label>
            <Input
              type="text"
              placeholder="Enter country (optional)"
              {...register("country")}
              error={!!errors.country}
              errorMessage={errors.country?.message}
            />
            </div>
          </div>

          {/* Document Information Section */}
          <div style={sectionContainerStyle}>
            <h2 style={sectionTitleStyle}>Document Information</h2>
            <div style={fieldGroupStyle}>
            <label style={labelStyle}>Document Type</label>
            <Controller
              name="document_type"
              control={control}
              render={({ field }) => (
                <Select
                  options={documentTypeOptions}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  error={!!errors.document_type}
                  errorMessage={errors.document_type?.message}
                />
              )}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Document Number</label>
            <Input
              type="text"
              placeholder="Enter document number (optional)"
              {...register("document_number")}
              error={!!errors.document_number}
              errorMessage={errors.document_number?.message}
            />
            </div>
          </div>

          {/* Separation Information Section (Conditional) */}
          {showSeparationFields && (
            <div style={sectionContainerStyle}>
              <h2 style={sectionTitleStyle}>Separation Information</h2>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>
                  Separation Initiated Date <span style={requiredLabelStyle}>*</span>
                </label>
                <Input
                  type="date"
                  {...register("separation_initiated_date")}
                  error={!!errors.separation_initiated_date}
                  errorMessage={errors.separation_initiated_date?.message}
                />
              </div>

              <div style={fieldGroupStyle}>
                <label style={labelStyle}>
                  Last Working Day <span style={requiredLabelStyle}>*</span>
                </label>
                <Input
                  type="date"
                  {...register("last_working_day")}
                  error={!!errors.last_working_day}
                  errorMessage={errors.last_working_day?.message}
                />
              </div>

              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Separation Reason</label>
                <Textarea
                  placeholder="Enter separation reason (optional)"
                  rows={3}
                  {...register("separation_reason")}
                  error={!!errors.separation_reason}
                  errorMessage={errors.separation_reason?.message}
                />
              </div>

              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Notice Period (Days)</label>
                <Input
                  type="number"
                  min={0}
                  max={365}
                  placeholder="Enter notice period in days (optional)"
                  {...register("notice_period_days", { valueAsNumber: true })}
                  error={!!errors.notice_period_days}
                  errorMessage={errors.notice_period_days?.message}
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div style={buttonContainerStyle}>
            <Button 
              type="button" 
              onClick={onCancel} 
              disabled={isLoading}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              isLoading={isLoading}
              size="lg"
            >
              Create Employee
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
});

