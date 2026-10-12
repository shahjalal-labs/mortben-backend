import { OrderStatus, PaymentType } from "@prisma/client";

export const paginationHelper = (query: {
  page: number;
  limit: number;
  search: string;
  status: OrderStatus;
  paymentType: PaymentType;
}) => {
  let {
    page = 1,
    limit = 10,
    search = "",
    status = "",
    paymentType = "",
  } = query;
  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;
  const take = limit;

  return { skip, take, limit, page, search, paymentType, status };
};
