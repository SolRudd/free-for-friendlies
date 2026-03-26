type FieldErrorProps = {
  id: string;
  error?: string;
};

export function FieldError({ id, error }: FieldErrorProps) {
  if (!error) {
    return null;
  }

  return (
    <p id={id} className="mt-2 text-sm text-rose-600">
      {error}
    </p>
  );
}
