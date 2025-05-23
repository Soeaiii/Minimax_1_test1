'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Users, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

interface Participant {
  id: string;
  name: string;
  bio?: string;
  team?: string;
  contact?: string;
}

interface ParticipantCardProps {
  participant: Participant;
}

export function ParticipantCard({ participant }: ParticipantCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-base">{participant.name}</CardTitle>
              {participant.team && (
                <CardDescription className="flex items-center mt-1">
                  <Users className="h-3 w-3 mr-1" />
                  {participant.team}
                </CardDescription>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* 参与者简介 */}
        {participant.bio && (
          <div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {participant.bio}
            </p>
          </div>
        )}

        {/* 联系信息 */}
        {participant.contact && (
          <div className="flex items-center space-x-2 text-sm">
            {participant.contact.includes('@') ? (
              <>
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">邮箱</span>
              </>
            ) : (
              <>
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">电话</span>
              </>
            )}
            <span className="font-medium">{participant.contact}</span>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/participants/${participant.id}`}>
              查看详情
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 