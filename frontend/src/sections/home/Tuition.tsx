'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CreditCard, Landmark, GraduationCap } from 'lucide-react';

const options = [
  {
    title: "Flexible Payment",
    description: "Installment plans available for all students to ease financial burden.",
    icon: CreditCard,
  },
  {
    title: "Scholarships",
    description: "Merit-based and need-based scholarships covering up to 100% tuition.",
    icon: GraduationCap,
  },
  {
    title: "Bank Financing",
    description: "Partnerships with top banks to provide low-interest student loans.",
    icon: Landmark,
  }
];

export default function Tuition() {
  return (
    <section className="py-24 bg-primary text-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-accent font-semibold tracking-wide uppercase mb-3">Tuition & Financial Aid</h2>
            <h3 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
              Investing in Your Future <br />
              <span className="text-accent">Shouldn't be a Burden</span>
            </h3>
            <p className="text-gray-300 text-lg mb-10">
              We are committed to making education accessible to everyone. Our financial aid office works tirelessly to provide options that suit every student's situation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact">
                <Button variant="accent" size="lg">Enquiries</Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                  Courses
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            {options.map((option, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-white hover:bg-white/10 transition-colors">
                  <CardContent className="p-6 flex items-start space-x-6">
                    <div className="bg-accent/20 p-4 rounded-xl text-accent shrink-0">
                      <option.icon size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{option.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{option.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
