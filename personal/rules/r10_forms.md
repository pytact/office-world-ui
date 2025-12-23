# R10 — Forms

## Purpose

Provide a strict, scalable, and type-safe architecture for building **forms** using:

* React Hook Form
* Zod validation
* Custom form hooks
* API error → fieldError mapping

This ensures every form in the system is consistent, predictable, and fully aligned with backend validation (mirroring rules defined in API specs).

---

## Instructions

1. All form files MUST live inside:

```
src/modules/<feature>/forms/
```

2. Every form MUST include:

* Zod schema
* Type inference
* Default values
* Custom submit hook
* Error mapping from API (422)

3. Components MUST NOT contain form logic.
4. Use `<Form />`, `<FormField />`, `<FormControl />`, `<FormItem />` from UI library.
5. Validation MUST be done ONLY with Zod.
6. All submission logic MUST be in a custom hook.
7. Mutation hooks must be used for API calls.

---

## Schema — Zod Validation

```ts
// user.schema.ts
import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
  role: z.enum(["admin", "user"]),
});

export type UserFormSchema = z.infer<typeof UserSchema>;
```

---

## Schema — useForm Setup

```ts
const form = useForm<UserFormSchema>({
  resolver: zodResolver(UserSchema),
  defaultValues,
});
```

❌ Never do inline validation like:

```tsx
<input required />
```

---

## Default Values

```ts
const defaultValues: UserFormSchema = {
  name: data?.name || "",
  email: data?.email || "",
  password: "",
  role: data?.role || "user",
};
```

---

## Submit Handler (Custom Hook)

```ts
// useUserFormSubmit.ts
export function useUserFormSubmit() {
  const createUser = useCreateUserMutation();
  const updateUser = useUpdateUserMutation();

  async function submit(values: UserFormSchema, id?: string) {
    if (id) return updateUser.mutateAsync({ id, ...values });
    return createUser.mutateAsync(values);
  }

  return { submit };
}
```

---

## Mapping API Errors → Form Errors

```ts
if (error.fieldErrors) {
  Object.entries(error.fieldErrors).forEach(([field, message]) => {
    form.setError(field as any, { message });
  });
}
```

---

## Container Component (Logic Only)

```tsx
export function UserFormContainer({ id }) {
  const form = useUserForm(defaultValues);
  const { submit } = useUserFormSubmit();

  const onSubmit = (values) => submit(values, id);

  return <UserForm form={form} onSubmit={onSubmit} />;
}
```

---

## UI Form Component (Pure Presentation)

```tsx
export function UserForm({ form, onSubmit }) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
```

---

## Form UX Rules

* Disable submit button when loading
* Show loader inside submit button
* Auto-focus on first error field
* Show success toast
* Proper error message under field
* Use placeholders + labels (never placeholder only)

---

## Create vs Edit Form Rules

**Create Form:**

* Empty defaults

**Edit Form:**

* Populate defaults from API response
* Disable protected fields if backend requires

---

## File Naming Convention

```
src/modules/users/forms/user.schema.ts
src/modules/users/forms/user.form.tsx
src/modules/users/forms/useUserFormSubmit.ts
```

Examples:

* `project.schema.ts`
* `project.form.tsx`
* `useProjectFormSubmit.ts`

---

## Important Notes

* Always use Zod for validation
* Never mutate data inside component
* Always map fieldErrors
* No inline validation in JSX
* UI component must remain pure
* Use reusable input components
* Separate container/UI logic strictly
* Follow consistent naming patterns

---

## End of Document
