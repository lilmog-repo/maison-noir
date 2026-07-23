import React from 'react';
import { motion } from 'framer-motion';
import { Collection } from '@/types';
import { cn } from '@/lib/utils';

interface CollectionCardProps {
  collection: Collection;
  className?: string;
}

export function CollectionCard({ collection, className }: CollectionCardProps) {
  return (
    <div className={cn("group relative cursor-pointer overflow-hidden aspect-[4/5] md:aspect-[3/4]", className)} data-testid={`card-collection-${collection.id}`}>
      <motion.img
        src={collection.imageUrl}
        alt={collection.name}
        className="w-full h-full object-cover"
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent pointer-events-none" />

      <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
        <h3 className="font-serif text-3xl md:text-4xl text-white tracking-wide">
          {collection.name}
        </h3>
        <p className="text-white/80 mt-2 text-sm uppercase tracking-widest flex items-center gap-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-[0.22,1,0.36,1]">
          Explore <span className="text-accent">→</span>
        </p>
      </div>
    </div>
  );
}
