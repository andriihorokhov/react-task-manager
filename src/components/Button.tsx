function Button({
  children,
  variant,
  type,
  className,
  disabled,
  onClick,
  ariaPressed,
}: {
  children: React.ReactNode;
  variant: 'primary' | 'secondary' | 'tertiary' | 'danger';
  type: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  ariaPressed?: boolean;
}) {
  const variants = {
    primary:
      'cursor-pointer rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50',
    secondary:
      'cursor-pointer rounded-full border border-stone-300 bg-white px-3 py-1 text-sm capitalize text-stone-700 transition-colors duration-150 hover:bg-stone-100',
    tertiary:
      'cursor-pointer rounded-md border border-stone-300 bg-white px-2.5 py-1 text-sm text-stone-700 transition-colors duration-150 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50',
    danger:
      'cursor-pointer rounded-md border border-red-200 bg-white px-2.5 py-1 text-sm text-red-700 transition-colors duration-150 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50',
  };

  const pressed =
    'cursor-pointer rounded-full bg-stone-900 px-3 py-1 text-sm capitalize text-white transition-colors duration-150 hover:bg-stone-700';

  return (
    <button
      type={type || 'button'}
      aria-pressed={ariaPressed}
      className={[ariaPressed ? pressed : variants[variant], className]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
