"use client"

import React from 'react';
import { useTheme } from "next-themes";
import { Moon, Sun } from 'lucide-react';
import { Switch } from './ui/switch';

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme()
  const isDarkTheme = theme === 'dark'

  return (
    <Switch
      thumbChild={isDarkTheme
        ? <Moon className="h-4 w-4" />
        : <Sun className="h-4 w-4" />
      }
      handleChange={() => { setTheme(isDarkTheme ? 'light' : 'dark') }}
      defaultChecked={!!isDarkTheme}
    />
  )
};

export default ThemeSwitch;