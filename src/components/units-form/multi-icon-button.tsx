import clsx from "clsx";
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { Button } from "../ui/button";

export default function MultiIconButton({
	onClick,
	disabled = false,
	variant = "default",
	icons,
	currentIndex = 0,
}: {
	onClick: (i: number) => void;
	disabled?: boolean;
	variant?: "default" | "outline" | "ghost";
	icons: ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
	>[];
	currentIndex?: number;
}) {
	const handleClick = () => {
		onClick(currentIndex);
	};

	return (
		<Button
			size="icon"
			onClick={handleClick}
			style={{ gridTemplateAreas: '"icon"' }}
			className="grid justify-center items-center"
			disabled={disabled}
			variant={variant}
		>
			{icons.map((V, i) => (
				<V
					key={i}
					className={clsx(
						"scale-0 opacity-0 transition-all duration-200",
						i === currentIndex && "opacity-100 scale-100",
					)}
					style={{ gridArea: "icon" }}
				/>
			))}
		</Button>
	);
}
