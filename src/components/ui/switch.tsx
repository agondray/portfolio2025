"use client"

import React from 'react';
import { Root, Thumb } from '@radix-ui/react-switch';
import { Sun, Moon } from 'lucide-react'

type SwitchProps = {
	thumbChild: React.ReactNode,
	handleChange: () => void,
	defaultChecked: boolean,
	rootClasses: string,
	thumbClasses: string,
};

export function Switch({ thumbChild, handleChange, defaultChecked, rootClasses, thumbClasses }: SwitchProps) {
	return (
		<Root
			className="relative h-[25px] w-[42px] cursor-default rounded-full bg-secondary border transition-all duration-200 ease-in focus:none data-[state=checked]:bg-dark-gray hover:shadow-[0px_0px_10px] shadow-accent-foreground"
			style={{ WebkitTapHighlightColor: "rgba(0, 0, 0, 0)" }}
			onCheckedChange={() => { handleChange() }}
			defaultChecked={defaultChecked}
		>
			<Thumb className="flex justify-center items-center size-[21px] translate-x-0.5 rounded-full bg-white transition-transform duration-200  data-[state=checked]:translate-x-[19px] data-[state=checked]:bg-black">
				<>
					{thumbChild}
				</>
			</Thumb>
		</Root>
	)
}