"use client";

import { FC, useEffect, useState } from "react";
import BlockColumn from "@/shared/components/block-column";
import ContainerColumn from "@/shared/components/container-column";
import Title from "@/shared/components/title";
import { getUsers } from "@/shared/queries/supa";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import moment from "moment";
import { UserSupabase } from "@/shared/lib/types/user-supabase.type";

const UsersPanel: FC = () => {
  const [users, setUsers] = useState<UserSupabase[]>([]);

  const handler = async () => {
    const { data } = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    handler();
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-full py-10">
      <BlockColumn>
        <Title text="Users" />
        <ContainerColumn blockStyles="w-full justify-center">
          <Table>
            <TableCaption>A list of users from Supabase.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">User</TableHead>
                <TableHead>Created at</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((item) => (
                <TableRow key={item.confirmed_at}>
                  <TableCell className="font-medium">{item.email}</TableCell>
                  <TableCell>
                    {moment(item.created_at).format("DD - MM - YY | HH:mm:ss")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ContainerColumn>
      </BlockColumn>
    </div>
  );
};

export default UsersPanel;
