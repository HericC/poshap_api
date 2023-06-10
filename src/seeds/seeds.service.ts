import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PlansRepository } from '../users/repositories/plans.prisma.repository';

@Injectable()
export class SeedsService {
  constructor(private readonly plansRepository: PlansRepository) {}

  async start() {
    await this.addPlans();
  }

  private async addPlans() {
    const array: Prisma.PlanCreateManyInput[] = [
      {
        key: 'basic',
        name: 'Basico',
        description: 'Acesso gratuito.',
        monthlyPrice: 0,
        quarterlyPrice: 0,
        semesterPrice: 0,
      },
      {
        key: 'silver',
        name: 'Prata',
        description:
          'Livre de propagandas e prioridade em todas as publicações.',
        monthlyPrice: 30,
        quarterlyPrice: 70,
        semesterPrice: 120,
      },
      {
        key: 'gold',
        name: 'Ouro',
        description:
          'Possui os mesmos beneficios do plano prata mais a opção de permitir o agendamento do serviço.',
        monthlyPrice: 50,
        quarterlyPrice: 120,
        semesterPrice: 200,
      },
    ];

    const plans: Prisma.PlanCreateManyInput[] = [];
    for (const item of array) {
      const plan = await this.plansRepository.findOne(item.key);
      if (!plan) plans.push(item);
    }

    if (!plans.length) return;
    await this.plansRepository.createMany(plans);
  }
}
